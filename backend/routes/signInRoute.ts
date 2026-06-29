import { Router } from "express";
import DBQuery from "../interfaces/DBInterface.ts";
import con from "../middlewares/connectToDB.ts";
const router = Router();
const port = 3001;

router.get('/signin',(req,res) => {
  console.log(req);
});
router.post('/signin',(req,res) => {
    var data:DBQuery = {query:"",data:["","",""]};
    let {userEmail,userPass,userName} = req.body;
    if(userEmail == null || userPass == null){
	console.log("incomplete data");
    }
    data.query = `INSERT INTO user(username,emailid,password) VALUES(?,?,?);`;
    data.data = [userName,userEmail,userPass];
    con.query(data.query,data.data,(err,result) => {
	if(err){
	    console.log(err.message);
	    return res.json(err.message);
	}else{
	    console.log(result);
	    return res.json("sending result");
	}
    });
});

export default router;
