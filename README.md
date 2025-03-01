# ProjetoPIS
Projeto da cadeira de PIS, realizado por Bruna Magarreiro e Rúben Dantas.

The updated code is in dev.

FIRST USE:
    To start write your mysql password in the file src/scripts/mysqlpassword.ts

    And run these four commands in order in the terminal:
        npm run build //to save the changes
        npm run initDatabase //to create the database
        npm run populateDatabase //to populate the database
        npm start


To start the server again:
    If no changes were made:
        npm start

    If any changes were made in the .ts files:
        npm run build
        npm start

ATTENTION
ALL the .js inside the div/src file are not to be edited directly, but instead in the corresponding .ts file in /src 
