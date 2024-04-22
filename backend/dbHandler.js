const mysql = require('mysql2')
const config = require('./config.json')
const { exit } = require('process');

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.pass,
    connectTimeout: config.mysql.timeout
});

async function connect() {
    try {
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                err ? reject(err) : resolve();
            })
        }) 
        console.log("Connected to database")
    } catch (err) {
        console.error(err)
        exit(1)
    }
} 

module.exports = { 
    connect,
    connection
};
