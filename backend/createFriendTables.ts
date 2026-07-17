import con from "./middlewares/connectToDB";

con.query(`
    CREATE TABLE IF NOT EXISTS friend_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender VARCHAR(100) NOT NULL,
        receiver VARCHAR(100) NOT NULL,
        status ENUM('pending', 'accepted') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_request (sender, receiver)
    );
`, (error, result) => {
    if(error){
        console.log("friend_requests table error:", error.message);
    }else{
        console.log("friend_requests table created:", result);
    }
});

con.query(`
    CREATE TABLE IF NOT EXISTS friends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user1 VARCHAR(100) NOT NULL,
        user2 VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_friendship (user1, user2)
    );
`, (error, result) => {
    if(error){
        console.log("friends table error:", error.message);
    }else{
        console.log("friends table created:", result);
    }
    con.end();
});
