import { Router } from "express";
import con from "../middlewares/connectToDB.ts";
import { MessageQuery } from "../interfaces/MessageQuery.ts";

const router = Router();

router.get('/', (req, res) => {
    res.send("Message Received");
});

router.post('/', (req, res) => {
    const {msg, userName, receiver} = req.body;
    const session = req.session;

    if(!msg || !userName || !receiver){
        return res.status(400).json({ message: "msg, userName, and receiver are required" });
    }

    const message: MessageQuery = {
        query: "",
        id: 0,
        text: msg,
        timestamp: Date.now().toString(),
        sender: userName,
        receiver: receiver
    };
    message.query = `INSERT INTO message(text, timeStamp, sender, receiver) VALUES(?,?,?,?);`;

    con.query(message.query, [message.text, message.timestamp, message.sender, message.receiver], 
	      (err, result) => {
        if(err){
            console.error(err.message);
            return res.status(500).json({ message: "Failed to store message" });
        }
        return res.json({ message: "Message stored", id: (result as any).insertId });
    });
});

router.get('/:sender/:receiver', (req, res) => {
    const { sender, receiver } = req.params;

    const query = `SELECT * FROM message 
        WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
        ORDER BY timeStamp ASC`;

    con.query(query, [sender, receiver, receiver, sender], (err, result) => {
        if(err){
            console.error(err.message);
            return res.status(500).json({ message: "Database error" });
        }
        return res.json({ messages: result });
    });
});

export default router;
