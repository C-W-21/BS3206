const dbHandler = require('../../dbHandler.js');

module.exports = async function handler(req, res) {
    const sql = "SELECT * FROM login WHERE `username` = ?";

    await new Promise((resolve, reject) => {
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            conn.changeUser({ database: "login" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            
                conn.query(sql, [req.body.username], async (err, data) => {
                    conn.release();
                    if(err) {
                        return res.json("Error");
                    }

                    if (data.length === 0) {
                        // User not found
                        return res.json("User not found");
                    }

                    // Compare hashed password in the database with the entered password
                    const passwordMatch = await bcrypt.compare(req.body.password, data[0].password);

                    if (passwordMatch) {
                        // Passwords match, login successful
                        // You might want to return some user data here if needed
                        return res.json("Login successful");
                    } else {
                        // Passwords don't match, login failed
                        return res.json("Incorrect password");
                    }
                }) 
            })
        })
    })
}
