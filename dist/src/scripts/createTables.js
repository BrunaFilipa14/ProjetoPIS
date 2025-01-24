import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword.js";
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.query(("CREATE TABLE competitions (competition_id INT PRIMARY KEY AUTO_INCREMENT, competition_name VARCHAR(100), competition_season VARCHAR(10));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("COMPETITIONS TABLE created!");
    }
});
connection.query(("CREATE TABLE teams (team_id INT PRIMARY KEY AUTO_INCREMENT, team_name VARCHAR(50) UNIQUE, team_initials VARCHAR (5), team_badge VARCHAR (1024), team_formedYear INT, team_stadium VARCHAR(100), team_country VARCHAR(50));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("TEAMS TABLE created!");
    }
});
connection.query(("CREATE TABLE competitions_teams (competition_team_id INT PRIMARY KEY AUTO_INCREMENT, competition_id INT, team_id INT, FOREIGN KEY(competition_id) REFERENCES competitions(competition_id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE)"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("COMPETITIONS_TEAMS TABLE created!");
    }
});
connection.query(("CREATE TABLE athletes (athlete_id INT PRIMARY KEY AUTO_INCREMENT, athlete_name VARCHAR(100) NOT NULL, athlete_birthDate DATE NOT NULL, athlete_height INT, athlete_weight DECIMAL (5, 2), athlete_nationality VARCHAR (50) NOT NULL, athlete_position VARCHAR (50), athlete_team_name VARCHAR(50), FOREIGN KEY(athlete_team_name) REFERENCES teams(team_name) ON DELETE CASCADE ON UPDATE CASCADE);"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("ATHLETES TABLE created!");
    }
});
connection.query(("CREATE TABLE games (game_id INT PRIMARY KEY AUTO_INCREMENT, game_house_team_id INT, game_visiting_team_id INT, game_result VARCHAR (10),game_date DATE,game_competition_id INT,FOREIGN KEY (game_house_team_id) REFERENCES teams(team_id),FOREIGN KEY (game_visiting_team_id) REFERENCES teams(team_id),FOREIGN KEY (game_competition_id) REFERENCES competitions(competition_id) ON DELETE CASCADE ON UPDATE CASCADE);"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("GAMES TABLE created!");
    }
});
connection.query(("CREATE TABLE statistics_athletes (statistic_id INT PRIMARY KEY AUTO_INCREMENT,statistic_athlete_id INT,statistic_game_id INT,statistic_points INT,statistic_rebounds INT,statistic_assists INT,statistic_blocks INT,statistic_steals INT,statistic_turnovers INT,statistic_three_pointers_made INT,statistic_free_throws_made INT, FOREIGN KEY(statistic_athlete_id) REFERENCES athletes(athlete_id), FOREIGN KEY(statistic_game_id) REFERENCES games(game_id) ON DELETE CASCADE ON UPDATE CASCADE);"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("STATISTICS TABLE created!");
    }
});
connection.query("CREATE TABLE users (user_id INT PRIMARY KEY AUTO_INCREMENT,user_type INT ,user_name VARCHAR (50) UNIQUE NOT NULL,user_password VARCHAR(225) UNIQUE NOT NULL)", (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("USERS TABLE created!");
    }
});
connection.query(("CREATE TABLE fav_athletes (fav_athlete_id INT PRIMARY KEY AUTO_INCREMENT,fav_athlete_user_id INT,fav_athlete_athlete_id INT,FOREIGN KEY(fav_athlete_user_id) REFERENCES users(user_id),FOREIGN KEY(fav_athlete_athlete_id) REFERENCES athletes(athlete_id)ON DELETE CASCADE ON UPDATE CASCADE);"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("FAV_ATHLETES TABLE created!");
    }
});
connection.query(("CREATE TABLE fav_teams (fav_team_id INT PRIMARY KEY AUTO_INCREMENT,fav_team_user_id INT,fav_team_team_id INT,FOREIGN KEY(fav_team_user_id) REFERENCES users(user_id),FOREIGN KEY(fav_team_team_id) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE);"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("FAV_TEAMS TABLE created!");
    }
});
connection.end((err) => {
    if (err) {
        console.error("Error closing the connection:", err);
    }
    else {
        console.log("connection closed.");
    }
});
