const mysql = require('mysql2');
const MYSQLPASSWORD = require("../../../scripts/mysqlpassword");

console.log(MYSQLPASSWORD);
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();

const getAllTeams = (req,res) => {
    connection.query("SELECT * FROM teams", (err, rows, fields) => {
        if (err)
            console.log(err);
        else{
            res.status(200).render('teams', {
                teams: rows
            });
        }
    });
};

const getTeamByName = (req, res) => {
    connection.query(`SELECT * FROM teams WHERE team_name = "${req.params.name}";`, (err, rows, fields) => {
        if(err){
            console.error("Error: " + err);
        }
        else if(rows.length > 0){
            res.status(200).render('teams', {
                teams: rows
            });
        }
        else{
            res.status(404).send("A equipa não existe!")
        }
    })
};
 


module.exports.getAllTeams = getAllTeams;
module.exports.getTeamByName = getTeamByName;