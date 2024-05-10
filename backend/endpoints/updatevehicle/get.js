const dbHandler = require('../../dbHandler.js')

// Get all saved metadata
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
            conn.changeUser({ database: "ims" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Run query
                conn.execute('CALL RetrieveVehicle()', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Map result
                    fmtResult = results[0].map((result, i) => {
                        return {
                            "id": result.id,
                            "brand": result.brand,
                            "model": result.model,
                            "emissions": result.emissions,
                            "capacity": result.occupancy
                        }
                    })
                    res.json(fmtResult)
                    resolve()
                })
            })
        })
    })
}