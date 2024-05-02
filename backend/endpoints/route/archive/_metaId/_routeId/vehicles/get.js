const dbHandler = require('../../../../../../dbHandler.js')

module.exports = async function handler(req, res) {
    const routeId = req.params.routeId

    await new Promise((resolve, reject) => {
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            conn.changeUser({ database: "rt" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

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