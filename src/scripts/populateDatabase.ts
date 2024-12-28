import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword";
const connectionOptions : mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
}
let teams: object[];

const connection : mysql.Connection = mysql.createConnection(connectionOptions);



fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        data.teams.forEach((team: { strTeam: string, strTeamShort: string, strBadge: string, intFormedYear: number, strStadium: string, strCountry: string;}) => {
            connection.query<mysql.ResultSetHeader>((`INSERT INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${team.strTeam}','${team.strTeamShort}','${team.strBadge}',${team.intFormedYear},'${team.strStadium}','${team.strCountry}');`), (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("TEAMS TABLE populated!");
                }
            });
        });
        
        /*teams = data.teams.map((team: { strTeam: string; strTeamShort: string; strBadge: string; intFormedYear: number; strStadium: string; strCountry: string; }) => ({
            team_name: team.strTeam,
            team_initials: team.strTeamShort,
            team_badge: team.strBadge,
            team_formedYear: team.intFormedYear,
            team_stadium: team.strStadium,
            team_country: team.strCountry
        }));*/
    })
    .catch((error) =>
        console.error("Unable to fetch data:", error));

/*setTimeout(() => {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("Stored Data:", teams);
}, 2000);*/