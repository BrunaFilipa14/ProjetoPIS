DROP DATABASE IF EXISTS projetopis;
CREATE DATABASE projetopis;
USE projetopis;

CREATE TABLE teams (
	team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(50),
    team_initials VARCHAR (10),
    team_formedYear INT,
    team_stadium VARCHAR(100),
    team_country VARCHAR(50)
);
CREATE TABLE competitions (
	competition_id INT PRIMARY KEY AUTO_INCREMENT,
    competition_name VARCHAR(100),
    competition_format VARCHAR(50),
    competition_winner_team_id INT,
    competition_season VARCHAR(50),
    FOREIGN KEY(competition_winner_team_id) REFERENCES teams(team_id)
);

CREATE TABLE athletes (
	athlete_id INT PRIMARY KEY AUTO_INCREMENT,
    athlete_name VARCHAR(100) NOT NULL,
	athlete_birthDate DATE NOT NULL,
    athlete_height DECIMAL (3, 2),
    athlete_weight DECIMAL (5, 2),
    athlete_nationality VARCHAR (50) NOT NULL,
    athlete_position VARCHAR (50),
    athlete_team_id INT,
    FOREIGN KEY(athlete_team_id) REFERENCES teams(team_id)
);

CREATE TABLE games (
	game_id INT PRIMARY KEY AUTO_INCREMENT,
    game_house_team_id INT,
    game_visiting_team_id INT,
    game_result VARCHAR (10),
    game_date DATE,
    game_competition_id INT,
    FOREIGN KEY (game_house_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (game_visiting_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (game_competition_id) REFERENCES competitions(competition_id)
);

CREATE TABLE statistics (
	statistic_id INT PRIMARY KEY AUTO_INCREMENT,
    statistic_athlete_id INT,
    statistic_game_id INT,
	statistic_points INT,
    statistic_rebounds INT,
    statistic_assists INT,
    statistic_blocks INT,
    statistic_steals INT,
    statistic_turnovers INT,
    statistic_three_pointers_made INT,
    statistic_free_throws_made INT,
    FOREIGN KEY(statistic_athlete_id) REFERENCES athletes(athlete_id),  
    FOREIGN KEY(statistic_game_id) REFERENCES games(game_id)
);



CREATE TABLE users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_type VARCHAR(5),
    user_name VARCHAR (50),
    user_password VARCHAR(50)
);

CREATE TABLE fav_athletes (
	fav_athlete_id INT PRIMARY KEY AUTO_INCREMENT,
    fav_athlete_user_id INT,
    fav_athlete_athlete_id INT,
    FOREIGN KEY(fav_athlete_user_id) REFERENCES users(user_id),
    FOREIGN KEY(fav_athlete_athlete_id) REFERENCES athletes(athlete_id)
);

CREATE TABLE fav_teams (
	fav_team_id INT PRIMARY KEY AUTO_INCREMENT,
    fav_team_user_id INT,
    fav_team_team_id INT,
    FOREIGN KEY(fav_team_user_id) REFERENCES users(user_id),
    FOREIGN KEY(fav_team_team_id) REFERENCES teams(team_id)
);
