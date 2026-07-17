import { Router } from "express";
import con from "../middlewares/connectToDB.ts";
import { sendToUser } from "../wsServer.ts";

const router = Router();

router.post('/request', (req, res) => {
    const { receiver } = req.body;
    const sender = req.session.user;

    if(!sender || !receiver){
        return res.status(400).json({ message: "sender and receiver are required" });
    }

    if(sender === receiver){
        return res.status(400).json({ message: "Cannot send friend request to yourself" });
    }

    con.query(
        "SELECT id FROM friend_requests WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)",
        [sender, receiver, receiver, sender],
        (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({ message: "Database error" });
            }

            if((result as any[]).length > 0){
                return res.status(409).json({ message: "Friend request already exists" });
            }

            con.query(
                "INSERT INTO friend_requests(sender, receiver, status) VALUES(?, ?, 'pending')",
                [sender, receiver],
                (err, result) => {
                    if(err){
                        console.error(err.message);
                        return res.status(500).json({ message: "Failed to send friend request" });
                    }

                    sendToUser(receiver, {
                        type: "friend_request",
                        sender: sender,
                        receiver: receiver,
                        requestId: (result as any).insertId
                    });

                    return res.json({ message: "Friend request sent", requestId: (result as any).insertId });
                }
            );
        }
    );
});

router.get('/requests', (req, res) => {
    const currentUser = req.session?.user;

    if(!currentUser){
        return res.status(401).json({ message: "Not authenticated" });
    }

    con.query(
        "SELECT id, sender, receiver, status, created_at FROM friend_requests WHERE receiver = ? AND status = 'pending'",
        [currentUser],
        (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({ message: "Database error" });
            }
            return res.json({ requests: result });
        }
    );
});

router.get('/', (req, res) => {
    const currentUser = req.session?.user;

    if(!currentUser){
        return res.status(401).json({ message: "Not authenticated" });
    }

    con.query(
        "SELECT user1, user2 FROM friends WHERE user1 = ? OR user2 = ?",
        [currentUser, currentUser],
        (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({ message: "Database error" });
            }

            const friends = (result as any[]).map((row: any) => 
                row.user1 === currentUser ? row.user2 : row.user1
            );

            return res.json({ friends });
        }
    );
});

router.post('/accept/:requestId', (req, res) => {
    const { requestId } = req.params;
    const currentUser = req.session?.user;

    if(!currentUser){
        return res.status(401).json({ message: "Not authenticated" });
    }

    con.query(
        "SELECT sender, receiver FROM friend_requests WHERE id = ? AND receiver = ? AND status = 'pending'",
        [requestId, currentUser],
        (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({ message: "Database error" });
            }

            const request = (result as any[])[0];
            if(!request){
                return res.status(404).json({ message: "Request not found" });
            }

            con.query(
                "UPDATE friend_requests SET status = 'accepted' WHERE id = ?",
                [requestId],
                (err) => {
                    if(err){
                        console.error(err.message);
                        return res.status(500).json({ message: "Failed to accept request" });
                    }

                    const user1 = request.sender;
                    const user2 = request.receiver;

                    con.query(
                        "INSERT INTO friends(user1, user2) VALUES(?, ?)",
                        [user1, user2],
                        (err) => {
                            if(err){
                                console.error(err.message);
                                return res.status(500).json({ message: "Failed to create friendship" });
                            }

                            sendToUser(request.sender, {
                                type: "friend_accepted",
                                sender: currentUser,
                                receiver: request.sender
                            });

                            return res.json({ message: "Friend request accepted" });
                        }
                    );
                }
            );
        }
    );
});

export default router;
