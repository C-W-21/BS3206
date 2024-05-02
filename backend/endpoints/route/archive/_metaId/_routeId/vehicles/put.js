const dbHandler = require('../../../../../../dbHandler.js')

module.exports = async function handler(req, res) {
    const routeId = req.params.routeId
    const data = req.body

    let rsp = {}
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

                const keys = Object.keys(data.vehicles);
                for (let i = 0; i < keys.length; i++) {
                    let vehicle = data.vehicles[keys[i]];

                    conn.query(`CALL create_route_vehicle(?, ?, ?)`, [routeId, keys[i], vehicle.emissions], (err, result) => {
                        conn.release();
        
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        rsp[keys[i]] = {id: result[0][0].id};
                        if (Object.keys(rsp).length === keys.length) resolve();
                    })
                }

                if (keys.length === 0) resolve();
            })
        })
    })

    res.json(rsp)
}