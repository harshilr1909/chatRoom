import {Router} from "express";
const router = Router();
import con from "../middlewares/connectToDB";
import DBQuery from "../interfaces/UserQuery.ts";
import { compareSync } from 'bcrypt-ts';

router.get('/',(req,res) => {
    res.send("login route working");
});

router.get('/session',(req,res) => {
    if (req.session.user) {
        res.json({user: req.session.user});
    } else {
        res.status(401).json({message: "No session"});
    }
});


router.post('/',(req,res) => {
    const {userName,userPass} = req.body;
    const data:DBQuery = {query:"",data:["","",""]};
    data.query = "SELECT password FROM user WHERE username = ?"
    con.query(data.query,[userName],(err,result) => {
	if(err){
	    console.log(err);
	    return res.json({
		message:err.message,
		code:err.code,
		errno:err.errno,
		sqlMessage:(err as any).sqlMessage
	    });
	}else{
	    console.log(result);
	    if (result.length === 0) 
		return res.status(401).json({message: "User not found"});
	    const matchedPass = compareSync(userPass,result[0].password);
	    if (!matchedPass) 
		return res.status(401).json({message: "Wrong password"});
	    req.session.user = userName;
	    console.log(req.session);
	    return res.json({message: "Login successful"});
	}
    });
});

router.delete('/session',(req,res) => {
    req.session = null;
    res.json({message: "Logged out"});
});

export default router;
