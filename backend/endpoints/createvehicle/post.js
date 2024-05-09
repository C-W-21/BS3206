const dbHandler = require('../../dbHandler.js')

module.exports = async function handler(req, res) {
    const data = req.body;

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

                conn.execute('CALL CreateVehicle(?,?)', data, (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
 
                    res.json({})
                    console.log(results)
                    resolve()
                })
            })
        })
    })

}
