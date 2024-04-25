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

                conn.execute('SELECT * FROM saved_routes_meta ORDER BY time_generated DESC', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    
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