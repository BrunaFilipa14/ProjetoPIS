import * as mysql from "mysql2";
import MYSQLPASSWORD from "../../../scripts/mysqlpassword";
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
};
const connection = mysql.createConnection(connectionOptions);
await populateQueryCompetitions(4546, 'EuroLeague Basketball');
try {
    const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
    if (!res.ok)
        throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    const basketballLeagues = data.leagues.filter((league) => league.strSport == "Basketball");
    for (const competition of basketballLeagues) {
        await populateQueryCompetitions(competition.idLeague, competition.strLeague);
    }
}
catch (error) {
    throw new Error(`Cannot fetch data, error:{error}`);
}
function populateQueryCompetitions(competitionId, competitionName) {
    connection.query((`INSERT INTO competitions (competition_id, competition_name) VALUES (${competitionId},'${competitionName}');`), (err, result) => {
        if (err) {
            console.log(err);
            return Promise.reject(err);
        }
    });
    console.log(`${competitionName} added to table COMPETITIONS!`);
}
