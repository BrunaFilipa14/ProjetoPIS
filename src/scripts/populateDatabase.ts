import * as mysql from "mysql2";
import * as fs from "fs/promises";
import MYSQLPASSWORD from "./mysqlpassword.js";
import * as bcrypt from "bcrypt";
import { json } from "stream/consumers";
import { count } from "console";
import { statSync } from "fs";
const connectionOptions: mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
}
const connection: mysql.Connection = mysql.createConnection(connectionOptions);
main();

//* MAIN
async function main() {
    try {
        await populateCompetitions();
        await populateTeams();
        await populateAthletes();
        await populateGames();
        await populateAdmins();
        await populateStatisticsPlayers();
        await populateStatisticsTeams();
    }
    catch (err) {
        console.log("Error Populating: ", err);
    }
    finally {
        connection.end((err) => {
            if (err) {
                console.error("Error closing the connection:", err);
            } else {
                console.log("connection closed.");
            }
        });
    }
}

//* POPULATE COMPETITIONS
async function populateCompetitions() {
    await populateQueryCompetitions('EuroLeague Basketball', '2021/2022');
    await populateQueryCompetitions('EuroLeague Basketball', '2022/2023');
    await populateQueryCompetitions('EuroLeague Basketball', '2023/2024');
    try {
        const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        const basketballLeagues: Array<{ idLeague: number, strLeague: String, strSport: String }> = data.leagues.filter((league: { idLeague: number, strLeague: String, strSport: String }) => league.strSport == "Basketball");

        for (const competition of basketballLeagues) {
            await populateQueryCompetitions(competition.strLeague, '2021/2022');
            await populateQueryCompetitions(competition.strLeague, '2022/2023');
            await populateQueryCompetitions(competition.strLeague, '2023/2024');
        }
    } catch (error) {
        throw new Error(`Cannot fetch data, error:${error}`);
    }
}

//* POPULATE TEAMS
//! Quando vai popular BC Andorra, dá erro porque o estádio tem ' no nome, por arranjar
async function populateTeams() {
    try {
        const competitions = await getCompetitions();
        console.log(competitions);

        for (const competition of competitions) {
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${competition.competitionName}`);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const data = await res.json();
            if (data.teams) {
                for (const team of data.teams) {
                    const team_id = await populateQueryTeams(
                        team.strTeam,
                        team.strBadge,
                        team.intFormedYear,
                        team.strStadium,
                        team.strCountry
                    );

                    await populateQueryCompTeam(competition.competitionId, team_id);
                }
            }
        }
    } catch (error : any) {
        console.error(`Cannot fetch data, error: ${error}`);
        throw new Error(`Error populating teams: ${error.message}`);
    }
}


//* POPULATE ATHLETES
//! Quando vai popular De'Aaron Fox, dá erro porque o nome tem ', por arranjar
async function populateAthletes() {
    const jsonData: string = await fs.readFile('dist/src/components/athlete/data/players.json', 'utf-8');
    const athletes: Array<{
        team_name: string,
        players: Array<{
            name: string,
            date_of_birth: string,
            height_cm: number,
            weight_kg: number,
            nationality: string,
            position: string
        }>
    }> = JSON.parse(jsonData);
    try {
        for (const teamAthletes of athletes) {
            for (const athlete of teamAthletes.players) {
                await populateQueryAthletes(teamAthletes.team_name, athlete.name, athlete.date_of_birth, athlete.height_cm, athlete.weight_kg, athlete.nationality, athlete.position);
            }
        }
    } catch (error) {
        throw new Error(`Cannot populate table, error:${error}`)
    }
}

//* POPULATE GAMES
async function populateGames() {
    await populateQueryGames(1, 2, "87-92", "2021-12-15", "09:00", 1);
await populateQueryGames(3, 4, "102-98", "2022-01-20", "09:30", 1);
await populateQueryGames(5, 6, "79-85", "2022-03-05", "10:00", 1);
await populateQueryGames(7, 8, "110-115", "2022-11-12", "10:30", 2);
await populateQueryGames(9, 10, "95-88", "2023-01-18", "11:00", 2);
await populateQueryGames(11, 12, "103-97", "2023-04-01", "11:30", 2);
await populateQueryGames(13, 14, "89-92", "2023-10-10", "12:00", 3);
await populateQueryGames(15, 16, "120-118", "2024-01-15", "12:30", 3);
await populateQueryGames(17, 18, "97-100", "2024-03-20", "13:00", 3);
await populateQueryGames(55, 56, "98-92", "2021-11-10", "13:30", 4);
await populateQueryGames(57, 58, "104-99", "2022-01-25", "14:00", 4);
await populateQueryGames(59, 60, "91-87", "2022-03-18", "14:30", 4);
await populateQueryGames(61, 62, "113-108", "2022-10-15", "15:00", 5);
await populateQueryGames(63, 64, "97-102", "2023-02-05", "15:30", 5);
await populateQueryGames(65, 66, "110-104", "2023-04-12", "16:00", 5);
await populateQueryGames(67, 68, "89-94", "2023-11-20", "16:30", 6);
await populateQueryGames(69, 70, "121-118", "2024-01-28", "17:00", 6);
await populateQueryGames(71, 72, "106-103", "2024-03-15", "17:30", 6);
await populateQueryGames(145, 146, "101-96", "2021-12-05", "18:00", 7);
await populateQueryGames(147, 148, "89-93", "2022-01-12", "18:30", 7);
await populateQueryGames(149, 150, "112-108", "2022-03-22", "19:00", 7);
await populateQueryGames(151, 152, "97-91", "2022-11-08", "19:30", 8);
await populateQueryGames(153, 154, "118-120", "2023-02-14", "20:00", 8);
await populateQueryGames(155, 156, "106-101", "2023-04-25", "20:30", 8);
await populateQueryGames(157, 158, "109-112", "2023-11-05", "21:00", 9);
await populateQueryGames(159, 160, "125-119", "2024-01-18", "09:00", 9);
await populateQueryGames(161, 162, "98-95", "2024-03-27", "09:30", 9);
await populateQueryGames(238, 239, "102-97", "2021-11-22", "10:00", 10);
await populateQueryGames(240, 241, "94-89", "2022-01-30", "10:30", 10);
await populateQueryGames(242, 243, "115-110", "2022-03-10", "11:00", 10);
await populateQueryGames(244, 245, "108-112", "2022-12-05", "11:30", 11);
await populateQueryGames(246, 247, "121-118", "2023-02-22", "12:00", 11);
await populateQueryGames(248, 249, "103-99", "2023-04-15", "12:30", 11);
await populateQueryGames(250, 251, "96-92", "2023-11-12", "13:00", 12);
await populateQueryGames(252, 253, "119-114", "2024-01-25", "13:30", 12);
await populateQueryGames(238, 240, "105-100", "2024-03-30", "14:00", 12);

}

//* POPULATE STATISTICS
async function populateStatisticsPlayers() {
    const jsonData: string = await fs.readFile('src/components/statistics/data/statisticsPlayers.json', 'utf-8');
    const statistics: Array<{
        athleteId: number,
        gameId: number,
        points: number,
        rebounds: number,
        assists: number,
        blocks: number,
        steals : number,
        turnovers : number,
        three_pointers_made : number,
        free_throws_made: number
    }> = JSON.parse(jsonData);
    try {
        for (const statistic of statistics) {
            await populateQueryStatisticsPlayers(statistic.athleteId,statistic.gameId,statistic.points,statistic.rebounds,statistic.assists,statistic.blocks,statistic.steals,statistic.turnovers,statistic.three_pointers_made,statistic.free_throws_made);
        }
    } catch (error) {
        throw new Error(`Cannot populate table, error:${error}`)
    }
}

async function populateStatisticsTeams(){
    let query =`INSERT INTO statistics_team (statistic_team_name, total_points, total_rebounds, total_assists, total_blocks, total_steals, total_turnovers, total_three_pointers_made, total_free_throws_made)
    SELECT 
    a.athlete_team_name AS statistic_team_name,
    SUM(sa.statistic_points) AS total_points,
    SUM(sa.statistic_rebounds) AS total_rebounds,
    SUM(sa.statistic_assists) AS total_assists,
    SUM(sa.statistic_blocks) AS total_blocks,
    SUM(sa.statistic_steals) AS total_steals,
    SUM(sa.statistic_turnovers) AS total_turnovers,
    SUM(sa.statistic_three_pointers_made) AS total_three_pointers_made,
    SUM(sa.statistic_free_throws_made) AS total_free_throws_made
    FROM 
    statistics_athletes sa
    JOIN 
    athletes a
    ON 
    sa.statistic_athlete_id = a.athlete_id
    GROUP BY 
    a.athlete_team_name;`;

    try {
        connection.query<mysql.ResultSetHeader>((query), (err, result) => {
            if (err) {
                console.log(err);
            }
        });
        console.log(`Populated teams' statistics`);
    } catch (error) {
        throw new Error(`Cannot populate table, error:${error}`)
    }
}

//* POPULATE USERS (ADMIN)
async function populateAdmins() {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);
    connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO users (user_type, user_name, user_password) VALUES (1,'Admin','${hashedPassword}');`), (err, result) => {
        if (err) {
            console.log(err);
        }
    });
    console.log(`USER created!`);
}


//* POPULATE QUERIES
function populateQueryCompetitions(competitionName: String, competitionSeason: String): Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO competitions (competition_name, competition_season) VALUES ('${competitionName}','${competitionSeason}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${competitionName} added to table COMPETITIONS!`);
        resolve();
    })

}

function populateQueryTeams(team_name: string, team_badge: string, team_formedYear: number, team_stadium: string, team_country: string): Promise<number> {
    return new Promise((resolve, reject) => {
        connection.query<mysql.ResultSetHeader>(
            `INSERT INTO teams (team_name, team_badge, team_formedYear, team_stadium, team_country)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE team_id=LAST_INSERT_ID(team_id);`,
            [team_name, team_badge, team_formedYear, team_stadium, team_country],
            (err, result) => {
                if (err) {
                    console.error(`Error inserting/updating team ${team_name}:`, err);
                    return reject(err);
                }
                const team_id = result.insertId;
                console.log(`Inserted/Updated team: ${team_name}, team_id: ${team_id}`);
                resolve(team_id);
            }
        );
    });
}


function populateQueryAthletes(team_name: string, name: string, date_of_birth: string, height_cm: number, weight_kg: number, nationality: string, position: string): Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO athletes (athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_team_name) VALUES ('${name}','${date_of_birth}','${height_cm}',${weight_kg},'${nationality}','${position}','${team_name}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${name} added to table Athletes!`);
        resolve();
    })
}


function populateQueryCompTeam(competition_id: number, team_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query<mysql.ResultSetHeader>(
            `INSERT IGNORE INTO competitions_teams (competition_id, team_id) VALUES (?, ?);`,
            [competition_id, team_id],
            (err, result) => {
                if (err) {
                    console.error(`Error linking team_id: ${team_id} with competition_id: ${competition_id}:`, err);
                    return reject(err);
                }
                console.log(`Link created: competition_id ${competition_id}, team_id ${team_id}`);
                resolve();
            }
        );
    });
}


function populateQueryGames(houseTeamId: number, visitTeamId: number, result: String, gameDate: String, time: String, competitionId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO games (game_house_team_id, game_visiting_team_id, game_result, game_date, game_competition_id, game_time) VALUES (${houseTeamId},${visitTeamId},'${result}','${gameDate}',${competitionId}, '${time}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`Game has been made!`);
        resolve();
    })
}

function populateQueryStatisticsPlayers(athlete_id: number, game_id: number, points: number, rebounds: number, assists: number, blocks: number, steals : number, turnovers : number, three_pointers : number, free_throws: number) : Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO statistics_athletes (statistic_athlete_id,statistic_game_id,statistic_points,statistic_rebounds,statistic_assists,statistic_blocks,statistic_steals,statistic_turnovers,statistic_three_pointers_made,statistic_free_throws_made) VALUES (${athlete_id},${game_id},${points},${rebounds},${assists},${blocks},${steals},${turnovers},${three_pointers},${free_throws});`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`Statistics added!`);
        resolve();
    })
}

//* GET DATA FROM DATABASE QUERIES
function getCompetitions(): Promise<Array<{ competitionId: number, competitionName: String }>> {
    //Interface para query
    interface CompetitionQueryResult extends mysql.RowDataPacket {
        competition_id: number;
        competition_name: string;
    }
    return new Promise((resolve, reject) => {
        connection.query<CompetitionQueryResult[]>((`SELECT competition_id, competition_name FROM competitions;`), (err, rows, result) => {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                const competitions: Array<{ competitionId: number, competitionName: String }> = rows.map((row: { competition_id: number, competition_name: string }) => ({ competitionId: row.competition_id, competitionName: row.competition_name }));
                console.log("rows: ", rows);
                console.log("COMPETITIONS TABLE data transferred to array");
                resolve(competitions);
            }
        });
    })
}