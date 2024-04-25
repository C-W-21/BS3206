const mysql = require('mysql2')
const config = require('./config.json')
const { exit } = require('process');

const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.pass,
    connectTimeout: config.mysql.timeout,
    connectionLimit: 100
});

async function connect() {
    try {
        await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                    conn.release()
                }
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
    pool
};
