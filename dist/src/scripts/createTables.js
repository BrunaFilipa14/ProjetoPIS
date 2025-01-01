"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2"));
const mysqlpassword_js_1 = __importDefault(require("./mysqlpassword.js"));
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: mysqlpassword_js_1.default,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.query(("CREATE TABLE teams (team_id INT PRIMARY KEY AUTO_INCREMENT, team_name VARCHAR(50) UNIQUE, team_initials VARCHAR (5), team_badge VARCHAR (1024), team_formedYear INT, team_stadium VARCHAR(100), team_country VARCHAR(50));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("TEAMS TABLE created!");
    }
});
connection.query(("CREATE TABLE competitions (competition_id INT PRIMARY KEY AUTO_INCREMENT, competition_name VARCHAR(100));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("COMPETITIONS TABLE created!");
    }
});
connection.query(("CREATE TABLE athletes (athlete_id INT PRIMARY KEY AUTO_INCREMENT, athlete_name VARCHAR(100) NOT NULL, athlete_birthDate DATE NOT NULL, athlete_height DECIMAL (3, 2), athlete_weight DECIMAL (5, 2), athlete_nationality VARCHAR (50) NOT NULL, athlete_position VARCHAR (50), athlete_team_name VARCHAR(50), FOREIGN KEY(athlete_team_name) REFERENCES teams(team_name));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("ATHLETES TABLE created!");
    }
});
connection.query(("CREATE TABLE games (game_id INT PRIMARY KEY AUTO_INCREMENT, game_house_team_id INT, game_visiting_team_id INT, game_result VARCHAR (10),game_date DATE,game_competition_id INT,FOREIGN KEY (game_house_team_id) REFERENCES teams(team_id),FOREIGN KEY (game_visiting_team_id) REFERENCES teams(team_id),FOREIGN KEY (game_competition_id) REFERENCES competitions(competition_id));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("GAMES TABLE created!");
    }
});
connection.query(("CREATE TABLE statistics (statistic_id INT PRIMARY KEY AUTO_INCREMENT,statistic_athlete_id INT,statistic_game_id INT,statistic_points INT,statistic_rebounds INT,statistic_assists INT,statistic_blocks INT,statistic_steals INT,statistic_turnovers INT,statistic_three_pointers_made INT,statistic_free_throws_made INT, FOREIGN KEY(statistic_athlete_id) REFERENCES athletes(athlete_id), FOREIGN KEY(statistic_game_id) REFERENCES games(game_id));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("STATISTICS TABLE created!");
    }
});
connection.query(("CREATE TABLE users (user_id INT PRIMARY KEY AUTO_INCREMENT,user_type VARCHAR(5),user_name VARCHAR (50),user_password VARCHAR(50));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("USERS TABLE created!");
    }
});
connection.query(("CREATE TABLE fav_athletes (fav_athlete_id INT PRIMARY KEY AUTO_INCREMENT,fav_athlete_user_id INT,fav_athlete_athlete_id INT,FOREIGN KEY(fav_athlete_user_id) REFERENCES users(user_id),FOREIGN KEY(fav_athlete_athlete_id) REFERENCES athletes(athlete_id));"), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("FAV_ATHLETES TABLE created!");
    }
});
connection.query(("CREATE TABLE fav_teams (fav_team_id INT PRIMARY KEY AUTO_INCREMENT,fav_team_user_id INT,fav_team_team_id INT,FOREIGN KEY(fav_team_user_id) REFERENCES users(user_id),FOREIGN KEY(fav_team_team_id) REFERENCES teams(team_id));"), (err, result) => {
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
