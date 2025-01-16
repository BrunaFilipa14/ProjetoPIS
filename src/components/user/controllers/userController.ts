import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import notifier from "node-notifier";
const SIGN_KEY = process.env.SIGN_KEY || "password";

const connectionOptions : mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection : mysql.Connection = mysql.createConnection(connectionOptions);
connection.connect();



const login = (req:Request, res:Response) => {
    const { username, password } = req.body;

    console.log("Login attempt:", req.body.username, req.body.password);

    const query = `SELECT * FROM users WHERE user_name = ?`;
    connection.query<mysql.RowDataPacket[]>(query, [username], async (err, rows) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Failed to fetch user." });
        }

        if(rows.length === 0) {
           return res.status(401).json({message: 'Invalid Login.'});
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if(!passwordMatch){
            return res.status(401).json({message: 'Invalid Login.'});
        }

        //auth ok
        const id = user.user_id; //id retornado da base de dados
        const token = jwt.sign({ id }, SIGN_KEY, {
            expiresIn: 1200 // expira em 20min (1200 segundos)
        });
        res.cookie('token', token, { httpOnly: true });
        res.json({ auth: true, token: token });
    });
};


// Hash and save the password
const signUp = async (req:Request, res:Response) => {
    try {
      const {username, password} = req.body;

      // Generate a salt and hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
    
      
      const checkUsername = new Promise((resolve, reject) => {connection.query<mysql.RowDataPacket[]>(`SELECT * FROM users WHERE user_name = ?`, username, async (err, rows) => {
          if (err) {
            console.error("Error saving user:", err);
            return reject(err);
          }
          if(rows.length > 0 ){
            notifier.notify({
              message: "Username already in use! Please choose a different one."
            });
            return;
          }
          resolve(rows || []);
        });
      });

      const results = await Promise.all([
        checkUsername
      ]);
  
      // Insert the user into the database
      const query = `INSERT INTO users (user_name, user_password, user_type) VALUES (?, ?, ?)`;
      const values = [username, hashedPassword, 1]; // user 1 - admin 0
  
      connection.query(query, values, (err, result) => {
        if (err) {
          console.error("Error saving user:", err);
          return;
        }
        console.log("User saved successfully with ID");
        res.status(201).json({ success: true });
      });
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  };

  // Example: Add a test user



export default {login, signUp};