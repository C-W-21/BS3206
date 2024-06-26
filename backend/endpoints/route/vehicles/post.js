const dbHandler = require('../../../dbHandler.js')

// Calculate most efficient vehicles to use given the distance and occupants of a trip
module.exports = async function handler(req, res) {
    const data = req.body;

    const vehicleData = await getVehicles();
    const {totalEmissions, vehicles} = calculateVehicles(data.occupants, vehicleData);

    res.status(200);
    
    // Convert rate of emissions to quantity for the trip
    Object.entries(vehicles).forEach(([key, val]) => {
        vehicles[key].emissions = emissionsRateToQty(val.emissions, data.distance);
    })

    res.json({
        "vehicles": vehicles,
        "emissions": emissionsRateToQty(totalEmissions, data.distance)
    });
}

function emissionsRateToQty(rate, distance) {
    const qty = (rate * (distance / 1000)) / 1000 // ( g/km * (m => km) ) => kg
    return parseFloat((qty).toFixed(2)) 
}

function calculateVehicles(occupants, vehicles) {
    // Work out the lowest emissions of any vehicle that can carry everyone in one
    let lowestSingleEmissions = null;
    vehicles = vehicles.map((vehicle) => {
        vehicle.emissions = parseFloat(vehicle.emissions);

        if (vehicle.occupancy >= occupants && (lowestSingleEmissions === null || vehicle.emissions < lowestSingleEmissions)) {
            lowestSingleEmissions = vehicle.emissions;
        }

        return vehicle;
    });

    // Filter out large occupancy vehicles that would carry everyone in one vehicle but would produce excessive emissions compared to other options
    if (lowestSingleEmissions !== null) vehicles = vehicles.filter(vehicle => vehicle.occupancy < occupants || vehicle.emissions <= lowestSingleEmissions);

    // recursive function which identifies what other cars are needed to meet desired occupancy
    const addVehicleToCombo = (selfIndex, vList, combo) => {
        const self = vList[selfIndex];
        combo = {
            vehicles: {...combo.vehicles, [self.license_plate]: { emissions: self.emissions }},
            totalEmissions: combo.totalEmissions + self.emissions,
            totalOccupancy: combo.totalOccupancy + self.occupancy
        };

        // if current combination of vehicles meets desired occupancy then return it as an option
        if (combo.totalOccupancy >= occupants) return [combo];

        // go through each other vehicle to find the next on that might work
        let combos = [];
        const remainingList = [...vList.slice(0, selfIndex), ...vList.slice(selfIndex + 1)];
        for (let i = 0; i < remainingList.length; i++) {
            combos.push(...addVehicleToCombo(i, remainingList, combo));
        }

        return combos;
    };

    // workout combinations of all the given vehicles that meet the desired occupancy
    let vehicleMatches = [];
    for (let i = 0; i < vehicles.length; i++) {
        vehicleMatches.push(...addVehicleToCombo(i, vehicles, {
            vehicles: {},
            totalEmissions: 0,
            totalOccupancy: 0
        }));
    }

    // get most efficient vehicle from results
    return vehicleMatches.length > 0 ? vehicleMatches.reduce((prev, curr) => (curr.totalEmissions < prev.totalEmissions ? curr : prev)) : {vehicles: [], emissions: null};
}

async function getVehicles() {
    return new Promise((resolve, reject) => {
        // Get connection from pool
        dbHandler.pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }

            // Set database
            conn.changeUser({ database: "ims" }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Run query
                conn.execute('SELECT * FROM ims.vehicles_utility_specifications', (err, results) => {
                    conn.release();
    
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    resolve(results)
                })
            })
        })
    })
}
