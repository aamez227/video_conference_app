
Create a mysql database with name video_conference and update the local mysql config of you system 
in /server/connect.ts

Then go to command line and enter below command to enter in mysql db

mysql -u yourusername -p

then enter your password

then use below command to create a new database and use it

use video_conference

the run below queries sequentially

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    sessionId INT,
    FOREIGN KEY (sessionId) REFERENCES conference_sessions(id)
);

CREATE TABLE conference_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostId INT,
    sessionName VARCHAR(100),
    sessionTime DATETIME,
    timerDuration INT,
    isExpired INT,
    raisedHands JSON,
    participants JSON,
    FOREIGN KEY (hostId) REFERENCES users(id)
);

Then run npm i in both the client and server folder

later run npm start in both of the folder and navigate to http://localhost:3000 to run the app