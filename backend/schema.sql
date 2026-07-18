CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    emailid VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    text LONGTEXT NOT NULL,
    sender VARCHAR(100) NOT NULL,
    receiver VARCHAR(100) NOT NULL,
    timestamp DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(100) NOT NULL,
    receiver VARCHAR(100) NOT NULL,
    status ENUM('pending', 'accepted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_request (sender, receiver)
);

CREATE TABLE IF NOT EXISTS friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1 VARCHAR(100) NOT NULL,
    user2 VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_friendship (user1, user2)
);
