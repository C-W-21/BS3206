const config = require('../../config.json')

// Calculate new route
module.exports = async function handler(req, res) {
    const data = req.body;

    // Define and format route parameters for external API
    const qryParams = {
        waypoints: `${data.src.lat},${data.src.lon}|${data.dest.lat},${data.dest.lon}`,
        mode: data.mode,
        type: data.type,
        apiKey: config.geoapify.key,
        units: "metric",
        lang: "en",
        traffic: data.traffic,
        format: "json",
    };

    // Set and apply default parameters
    const qryDefaults = {
        mode: "drive",
        type: "short",
        traffic: "free_flow",
    };
    var qryList = [];
    Object.keys(qryParams).forEach(key => qryList.push(`${key}=${qryParams[key] == undefined || qryParams[key] == null ? qryDefaults[key] : qryParams[key]}`));

    // Make request
    const url = `https://api.geoapify.com/v1/routing?${qryList.join("&")}`;
    const geoApiRsp = await fetch(url);

    // Handle response
    res.status(geoApiRsp.status);
    if (geoApiRsp.status === 200) {
        const geoApiRspJson = await geoApiRsp.json();
        res.json(geoApiRspJson);
    } else {
        res.send(geoApiRsp.text());
    }
}
