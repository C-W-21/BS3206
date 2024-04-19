const config = require('../../config.json')

module.exports = async function handler(req, res) {
    const data = req.body;

    const qryParams = {
        waypoints: `${data.src.lat},${data.src.lon}|${data.dest.lat},${data.src.lon}`,
        mode: data.mode,
        type: data.type,
        apiKey: config.geoapify.key,
        units: "metric",
        lang: "en",
        traffic: data.traffic,
        format: "json",
    };
    const qryDefaults = {
        mode: "drive",
        type: "short",
        traffic: "free_flow",
    };
    var qryList = [];
    for (key in qryParams) {
        qryList.push(`${key}=${qryParams[key] == undefined || qryParams[key] == null ? qryDefaults[key] : qryParams[key]}`)
    }
    const qryStr = qryList.join("&")

    const url = `https://api.geoapify.com/v1/routing?${qryStr}`

    const geoApiRsp = await fetch(url)
    res.status(geoApiRsp.status)
    if (geoApiRsp.status === 200) {
        const geoApiRspJson = await geoApiRsp.json()
        res.json(geoApiRspJson)
    } else {
        res.send(geoApiRsp.text())
    }
}
