const dbHandler = require('../../../../../../dbHandler.js')

// Get saved vehicles associated with route
module.exports = async function handler(req, res) {
    const routeId = req.params.routeId

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
                conn.query(`SELECT * FROM rt.route_vehicles WHERE route_id = ?`, [routeId], (err, result) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    let rsp = {
                        vehicles: {},
                        emissions: 0
                    }

                    // Correct datatypes to return to client
                    result.forEach(vehicle => {
                        rsp.vehicles[vehicle.vehicle_id] = {
                            id: vehicle.id,
                            emissions: parseFloat(vehicle.emissions)
                        };
                        rsp.emissions += parseFloat(vehicle.emissions);
                    });
                    res.json(rsp)
                    resolve()
                })
            })
        })
    })
}