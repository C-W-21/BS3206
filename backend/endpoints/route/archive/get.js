const dbHandler = require('../../../dbHandler.js')

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
            conn.changeUser({ database: "rt" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Run query
                conn.execute('SELECT * FROM rt.saved_routes_meta ORDER BY time_generated DESC', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    // Transform result for client
                    fmtResult = results.map((result, i) => {
                        return {
                            "meta_id": result.id,
                            "time_generated": result.time_generated,
                            "occupants": result.occupants,
                            "src": {
                                "lat": result.src.y,
                                "lon": result.src.x
                            },
                            "dest": {
                                "lat": result.dest.y,
                                "lon": result.dest.x
                            }
                        }
                    })
                    res.json(fmtResult)
                    resolve()
                })
            })
        })
    })
}