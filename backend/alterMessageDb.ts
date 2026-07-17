import con from "./middlewares/connectToDB";

con.query(`
    ALTER TABLE message
    ADD COLUMN receiver VARCHAR(100) NOT NULL AFTER sender;
`, (error, result) => {
    if(error){
        console.log(error.message);
    }else{
        console.log("message table altered: ", result);
    }
    con.end();
});
