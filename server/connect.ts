import mysql from "mysql"

export const db = mysql.createConnection({
  host:"localhost",
  user:"your username",
  password:"your password",
  database:"video_conference"
})