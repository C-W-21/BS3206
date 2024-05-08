const mysql = require('mysql2');
const retry = require('retry');
const config = require('./config.json');
const { exit } = require('process');

// Define connection pool for use by endpoint handlers
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.pass,
    connectTimeout: config.mysql.timeout,
    connectionLimit: 100
});

const retryOpts = {
    retries: 5,
    factor: 1,
    minTimeout: 5000 // 5s
};

async function connect() {
    const operation = retry.operation(retryOpts);

    try {
        await new Promise((resolve, reject) => {
            // Poll connecting database waiting for it to come online
            operation.attempt(function(attempt) {
                pool.getConnection((err, conn) => {
                    if (operation.retry(err)) {
                        console.warn("Failed to connect to MySQL DB, polling...");
                        return;
                    }
    
                    if (err) {
                        console.error(`Failed to connect to MySQL after ${attempt} attempt(s), stopping.`);
                        reject(err);
                    } else {
                        console.log("Connected to MySQL DB");
                        conn.release();
                        resolve();
                    }
                });
            });
        });
    } catch (err) {
        console.error(err);
        exit(1);
    }
} 

module.exports = { 
    connect,
    pool
};
