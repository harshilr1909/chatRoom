import { Router } from "express";
import con from "../middlewares/connectToDB.ts";

const router = Router();

router.get('/', (req, res) => {
    const currentUser = req.session.user;

    con.query(
        "SELECT username FROM user WHERE username != ?",
        [currentUser],
        (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({ message: "Database error" });
            }
            const users = (result as any[]).map((row: any) => row.username);
            return res.json({ users });
        }
    );
});

router.get('/search', (req, res) => {
    const { q } = req.query;
    const currentUser = req.session.user;

    if(!q){
        return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    con.query(
        "SELECT username FROM user WHERE username != ? AND username LIKE ?",
        [currentUser, `%${q}%`],
        (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({ message: "Database error" });
            }
            const users = (result as any[]).map((row: any) => row.username);
            return res.json({ users });
        }
    );
});

export default router;
