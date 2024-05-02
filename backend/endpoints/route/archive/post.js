const dbHandler = require('../../../dbHandler.js')

// Save new route metadata
module.exports = async function handler(req, res) {
    const data = req.body

    await new Promise((resolve, reject) => {
        // Get new connection from pool
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            // Set database
            conn.changeUser({ database: "rt" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Run query
                conn.query('CALL create_route_meta(?, POINT(?, ?), POINT(?, ?))', [
                    data.occupants, 
                    ...[data.src.lon, data.src.lat], 
                    ...[data.dest.lon, data.dest.lat]
                ], (err, result) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    res.json(result[0][0])
                    resolve()
                })
            })
        })
    })
}