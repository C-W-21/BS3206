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

                conn.execute('CALL RetrieveVehicle()', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    fmtResult = results[0].map((result, i) => {
                        return {
                            "id": result.id,
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