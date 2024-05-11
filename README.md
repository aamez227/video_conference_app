
# Setting up Video Conference MySQL Database

To set up the MySQL database for the Video Conference application, follow these steps:

## Create the Database

```bash
CREATE DATABASE video_conference;
```

## Update MySQL Configuration

Update the local MySQL configuration in /server/connect.ts with the appropriate credentials for your MySQL instance.

## Access MySQL Command Line

Enter the following command in the terminal to access the MySQL command line:

```bash
mysql -u yourusername -p
```

Replace yourusername with your MySQL username and enter your password when prompted.

## Create and Use the Database

Once logged in, create and switch to the video_conference database by executing:

```bash
CREATE DATABASE IF NOT EXISTS video_conference;
USE video_conference;
```

## Create Tables
Run the following SQL queries sequentially to create the necessary tables:

### Users Table

```bash
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(100)
);
```

### Participants Table

```bash
CREATE TABLE IF NOT EXISTS participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  sessionId INT,
  FOREIGN KEY (sessionId) REFERENCES conference_sessions(id)
);
```

### Conference Sessions Table

```bash
CREATE TABLE IF NOT EXISTS conference_sessions (
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
```

## Install Dependencies

Navigate to both the client and server folders and install dependencies using npm:

```bash
cd client
npm install

cd ../server
npm install
```

## Start the Application
Finally, start the client and server applications:

```bash
cd client
npm start

cd ../server
npm start
```

Access the application by navigating to http://localhost:3000 in your web browser.
