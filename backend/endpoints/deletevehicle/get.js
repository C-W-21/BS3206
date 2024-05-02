const dbHandler = require('../../dbHandler.js')

module.exports = async function handler(req, res) {
    const searchQuery = req.query.rh;

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

                conn.query('CALL DeleteVehicle(?)', searchQuery, (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    res.json(fmtResult)
                    resolve()
                })
            })
        })
    })
}