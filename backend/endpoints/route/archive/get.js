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
                                "lat": result.src.x,
                                "lon": result.src.y
                            },
                            "dest": {
                                "lat": result.dest.x,
                                "lon": result.dest.y
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