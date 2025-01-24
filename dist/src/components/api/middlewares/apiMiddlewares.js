import * as mysql from "mysql2";
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
};
function logs(req, res, next) {
    const connection = mysql.createConnection(connectionOptions);
    let log = {
        OriginAddress: req.headers.referer,
        Timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        url: req.originalUrl
    };
    connection.query((`INSERT IGNORE INTO logs (log_origin_address, log_timestamp, log_url) VALUES ('${log.OriginAddress}','${log.Timestamp}','${log.url}');`), (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}
export default logs;
