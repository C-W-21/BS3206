const dbHandler = require('../../../dbHandler.js')

module.exports = async function handler(req, res) {
    const data = req.body

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

                conn.query('CALL create_route_meta(?, POINT(?, ?), POINT(?, ?))', [
                    data.occupants, 
                    ...[data.src.lon, data.src.lat], 
                    ...[data.dest.lon, data.dest.lat]
                ], (err, result) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    res.json(result[0][0])
                    resolve()
                })
            })
        })
    })
}