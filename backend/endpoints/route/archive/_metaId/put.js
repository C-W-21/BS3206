const dbHandler = require('../../../../dbHandler.js')

module.exports = async function handler(req, res) {
    const metaId = req.params.metaId
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

                // Transform waypoints for MySQL geospatial formats
                let waypointsData = [];
                data.waypoints.forEach((waypoint) => {
                    waypointsData.push(...waypoint.location);
                })
                const waypointsQry = `MULTIPOINT(${"POINT(?, ?), ".repeat(waypointsData.length / 2).slice(0, -2)})`;

                // Transform geometry coords for MySQL geospatial formats
                let geometryData = [];
                let geometryQryParts = [];
                data.geometry.forEach((leg) => {
                    let legData = [];
                    leg.forEach((point) => {
                        legData.push(point.lon, point.lat);
                    })
                    geometryData.push(...legData);
                    geometryQryParts.push(`LINESTRING(${"POINT(?, ?), ".repeat(legData.length / 2).slice(0, -2)})`)
                })
                const geometryQry = `MULTILINESTRING(${geometryQryParts.join(", ")})`

                conn.query(`CALL create_route(?, ?, ?, ?, ?, ?, ?, ${waypointsQry}, ${geometryQry})`, [
                    metaId, 
                    data.mode, 
                    data.units, 
                    data.traffic, 
                    data.distance, 
                    data.distance_units, 
                    data.time, 
                    ...waypointsData,
                    ...geometryData
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