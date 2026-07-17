import con from "../middlewares/connectToDB";

con.query('TRUNCATE TABLE user',(err,result) => {
    if(err){
	console.log(err);
    }else{
	console.log("table emptied");
    }
});

con.query('ALTER TABLE user MODIFY COLUMN password VARCHAR(100)',(err,res) => {
    if(err){
	console.log(err);
    }else{
	console.log(res);
    }
});
