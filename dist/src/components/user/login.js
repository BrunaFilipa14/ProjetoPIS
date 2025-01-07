import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../scripts/mysqlpassword.js";
import jwt from "jsonwebtoken";
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();
const login = (req, res) => {
    const query = `SELECT * FROM users WHERE user_username = ? AND user_password_hash = ?`;
    connection.query(query, [req.body.username, req.body.password], (err, rows) => {
        if (err) {
            console.error("Error fetching players:", err);
            return res.status(500).json({ error: "Failed to fetch players." });
        }
        if (rows.length > 0) {
            //auth ok
            const id = rows[0].user_id; //id retornado da base de dados
            const token = jwt.sign({ id }, 'palavrasecreta', {
                expiresIn: 7200 // expira em 2horas (7200 segundos)
            });
            return res.json({ auth: true, token: token });
        }
        res.status(500).json({ message: 'Invalid Login.' });
    });
};
export default login;
