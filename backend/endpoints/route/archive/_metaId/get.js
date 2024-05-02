const dbHandler = require('../../../../dbHandler.js')

// Get saved routes associated with metadata
module.exports = async function handler(req, res) {
    const metaId = req.params.metaId

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

                // Run query to get metadata
                conn.query('SELECT * FROM rt.saved_routes_meta WHERE id = ?', metaId, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    const metaInfo = result[0]
                    
                    // Run query to get routes
                    conn.query('SELECT * FROM rt.saved_routes WHERE meta_id = ?', metaId, (err, result) => {
                        conn.release();
        
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        // Transform data for client to be consistent with originally generated data from external API
                        res.json({
                            "results": result.map((route, i) => {
                                return {
                                    "id": route.id,
                                    "mode": route.mode,
                                    "waypoints": route.waypoints.map((waypoint, j) => {
                                        return {
                                            "location": [waypoint.x, waypoint.y],
                                            "original_index": j
                                        }
                                    }),
                                    "units": route.units,
                                    "traffic": route.traffic,
                                    "distance": route.distance,
                                    "distance_units": route.distance_units,
                                    "time": parseFloat(route.time),
                                    "legs": null,
                                    "geometry": route.route.map((leg, k) => {
                                        return leg.map((point, l) => {
                                            return {
                                                "lat": point.y,
                                                "lon": point.x
                                            }
                                        })
                                    })
                                }
                            }),
                            "properties": {
                                "mode": null,
                                "waypoints": [
                                    {
                                        "lat": metaInfo.src.y,
                                        "lon": metaInfo.src.x
                                    },
                                    {
                                        "lat": metaInfo.dest.y,
                                        "lon": metaInfo.dest.x
                                    },
                                ],
                                "units": null,
                                "traffic": null
                            }
                        })
                        
                        resolve()
                    })
                })
            })
        })
    })
}