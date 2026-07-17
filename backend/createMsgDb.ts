import con from "./middlewares/connectToDB";


con.query(`
	  CREATE TABLE message ( 
				user_id INT,
				text LONGTEXT NOT NULL ,
				sender VARCHAR(100) NOT NULL ,
				timestamp DATE NOT NULL ,

				FOREIGN KEY(user_id) REFERENCES user(id)
			       );
			       `
	    ,(error,result) => {
	if(error){
	    console.log(error.message);
	}else{
	    console.log("Database recieved: ",result);
	}
	    }
	 )
	  
