import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();
const login = (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", req.body.username, req.body.password);
    const query = `SELECT * FROM users WHERE user_username = ?`;
    connection.query(query, [username], async (err, rows) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Failed to fetch user." });
        }
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid Login.' });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.user_password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Login.' });
        }
        //auth ok
        const id = user.user_id; //id retornado da base de dados
        const token = jwt.sign({ id }, 'palavrasecreta', {
            expiresIn: 7200 // expira em 2horas (7200 segundos)
        });
        return res.json({ auth: true, token: token });
    });
};
const signUp = (req, res) => {
};
// Hash and save the password
const saveEncryptedPassword = async (username, plainPassword) => {
    try {
        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        // Insert the user into the database
        const query = `INSERT INTO users (user_username, user_password_hash, user_type) VALUES (?, ?, ?)`;
        const values = [username, hashedPassword, "user"]; // Assuming a default user type of "user"
        connection.query(query, values, (err, result) => {
            if (err) {
                console.error("Error saving user:", err);
                return;
            }
            console.log("User saved successfully with ID");
        });
    }
    catch (error) {
        console.error("Error hashing password:", error);
    }
};
// Example: Add a test user
export default { login, signUp };
