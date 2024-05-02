const dbHandler = require('../../dbHandler.js')

module.exports = async function handler(req, res) {
    const data = req.body

    await new Promise((resolve, reject) => {
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            conn.changeUser({ database: "ims" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                conn.execute('CALL RetrieveJoinedVehicles()', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    fmtResult = results[0].map((result, i) => {
                        return {
                            "license": result.license_plate,
                            "id": result.id,
                            "dupid": result.specifications_id,
                            "brand": result.brand,
                            "model": result.model,
                            "emissions": result.emissions,
                            "image": result.image,
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