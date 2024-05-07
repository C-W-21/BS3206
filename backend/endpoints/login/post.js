const bcrypt = require('bcryptjs');
const dbHandler = require('../../dbHandler.js');

module.exports = async function handler(req, res) {
    const { username, password } = req.body;

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

                conn.query(sql, [username], async (err, data) => {
                    conn.release();
                    if (err) {
                        return res.json("Error");
                    }

                    if (data.length === 0) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }

                    const hashedPassword = data[0].password;
                    const passwordMatch = await bcrypt.compare(password.toString(), hashedPassword.toString());

                    if (passwordMatch) {
                        successMessage = "success"
                        res.json({ message: successMessage });
                    } else {
                        res.status(401).json({ message: "Password, Username or both are incorrect" });
                    }

                    resolve();
                });
            });
        });
    });
};
