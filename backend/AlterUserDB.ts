import con from "./middlewares/connectToDB";

con.query( `
	  ALTER TABLE user
	  ADD PRIMARY KEY (id);
	  `,(err,result) => {
	      if(err){
		  console.error(err);
	      }else{
		  console.log("Table updated: ",result);
	      }
	  });
