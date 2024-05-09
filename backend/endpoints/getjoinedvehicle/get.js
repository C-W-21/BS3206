const dbHandler = require('../../dbHandler.js')

// Get all saved metadata
module.exports = async function handler(req, res) {
    const data = req.body

    // Get new connection from pool
    await new Promise((resolve, reject) => {
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
                conn.execute('CALL RetrieveJoinedVehicles()', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Map Results
                    fmtResult = results[0].map((result, i) => {
                        return {
                            "license": result.license_plate,
                            "id": result.id,
                            "dupid": result.specifications_id,
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