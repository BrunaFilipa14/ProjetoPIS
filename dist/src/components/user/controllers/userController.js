import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import notifier from "node-notifier";
const SIGN_KEY = process.env.SIGN_KEY || "password";
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
    const query = `SELECT * FROM users WHERE user_name = ?`;
    connection.query(query, [username], async (err, rows) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Failed to fetch user." });
        }
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid Login.' });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Login.' });
        }
        //auth ok
        const id = user.user_id; //id retornado da base de dados
        const type = user.user_type;
        const token = jwt.sign({ id, type }, SIGN_KEY, {
            expiresIn: 1200 // expira em 20min (1200 segundos)
        });
        res.cookie('token', token, { httpOnly: true });
        res.json({ auth: true, token: token });
    });
};
const signUp = async (req, res) => {
    try {
        const { username, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const checkUsername = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM users WHERE user_name = ?`, username, async (err, rows) => {
                if (err) {
                    console.error("Error saving user:", err);
                    return reject(err);
                }
                if (rows.length > 0) {
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
        const query = `INSERT INTO users (user_name, user_password, user_type) VALUES (?, ?, ?)`;
        const values = [username, hashedPassword, 0]; // user 0 - admin 1
        connection.query(query, values, (err, result) => {
            if (err) {
                console.error("Error saving user:", err);
                return;
            }
            console.log("User saved successfully with ID");
            res.status(201).json({ success: true });
        });
    }
    catch (error) {
        console.error("Error hashing password:", error);
    }
};
function authorize(requiredUserType) {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ error: "No token provided" });
        }
        jwt.verify(token, SIGN_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }
            if (decoded.type !== requiredUserType) {
                return res.status(403).json({ error: "Forbidden access" });
            }
            req.user = decoded;
            next();
        });
    };
}
export default { login, signUp, authorize };
