const dbHandler = require('../../../../../../dbHandler.js')

// Save vehicle selection associated with route
module.exports = async function handler(req, res) {
    const routeId = req.params.routeId
    const data = req.body

    let rsp = {}
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

                // For each vehicle
                const keys = Object.keys(data.vehicles);
                for (let i = 0; i < keys.length; i++) {
                    let vehicle = data.vehicles[keys[i]];

                    // Run query to save vehicle
                    conn.query(`CALL create_route_vehicle(?, ?, ?)`, [routeId, keys[i], vehicle.emissions], (err, result) => {
                        conn.release();
        
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        // Return inserted ID
                        rsp[keys[i]] = {id: result[0][0].id};
                        if (Object.keys(rsp).length === keys.length) resolve();
                    })
                }

                // If there were no vehicles then exit
                if (keys.length === 0) resolve();
            })
        })
    })

    res.json(rsp)
}