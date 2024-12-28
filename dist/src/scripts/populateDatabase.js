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
const mysqlpassword_1 = __importDefault(require("./mysqlpassword"));
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: mysqlpassword_1.default
};
let teams;
const connection = mysql.createConnection(connectionOptions);
fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA")
    .then((res) => {
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
})
    .then((data) => {
    data.teams.forEach((team) => {
        connection.query((`INSERT INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${team.strTeam}','${team.strTeamShort}','${team.strBadge}',${team.intFormedYear},'${team.strStadium}','${team.strCountry}');`), (err, result) => {
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
    .catch((error) => console.error("Unable to fetch data:", error));
/*setTimeout(() => {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("Stored Data:", teams);
}, 2000);*/ 
