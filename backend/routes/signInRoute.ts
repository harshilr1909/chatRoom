import { Router } from "express";
import DBQuery from "../interfaces/UserQuery.ts";
import con from "../middlewares/connectToDB.ts";
import { hashSync } from "bcrypt-ts";
const router = Router();
const port = 3001;

    
router.get('/signin',(req,res) => {
  console.log(req);
  res.send("sending Data");
});


router.post('/signin',(req,res) => {
    var data:DBQuery = {query:"",data:["","",""]};
    let {userEmail,userPass,userName} = req.body;
    const session = req.session;
    console.log(session);

    if(userEmail == null || userPass == null){
	console.log("incomplete data");
    }

    const hashedPass = hashSync(userPass,10); 

    data.query = `INSERT INTO user(username,emailid,password) VALUES(?,?,?);`;
    data.data = [userName,userEmail,hashedPass];

    con.query(data.query,data.data,(err,result) => {
	if(err){
	    console.log(err.message);
	    return res.json({
		message:err.message,
		code:err.code,
		errno:err.errno,
		sqlMessage:(err as any).sqlMessage
	    });
	}else{
	    console.log(result);
	    req.session.user = userName;
	    return res.json("sending result");
	}
    });
});

export default router;
