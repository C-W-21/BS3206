const dbHandler = require('../../dbHandler.js')

// Get all saved metadata
module.exports = async function handler(req, res) {
    const searchQuery = req.query.rh;

    await new Promise((resolve, reject) => {
        // Get new connection from pool
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            // Set database
            conn.changeUser({ database: "ims" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Run query
                conn.query('CALL DeleteVehicle(?)', searchQuery, (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    res.json(fmtResult)
                    resolve()
                })
            })
        })
    })
}