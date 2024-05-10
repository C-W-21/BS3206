const dbHandler = require('../../dbHandler.js')

module.exports = async function handler(req, res) {
    const username = req.body.username
    const password = req.body.password
    const sql = "INSERT INTO login (`username`, `password`) VALUES (?, ?)";

    await new Promise((resolve, reject) => {
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            // Change to the login schema
            conn.changeUser({ database: "login" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Run the above sql query and insert the username and password provided
                conn.query(sql, [username, password], (err, data) => {
                    conn.release();
                    if(err) {
                        return res.json("Error");
                    }
                    res.json(data);
                    resolve();
                }) 
            
                
            })
        })
    })

}