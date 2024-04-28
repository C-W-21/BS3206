const commHeaders = {
    "Content-Type": "application/json"
}

export async function planRoute(src, dest, goal) {
    const req = {
        src: { lat: src[0], lon: src[1] },
        dest: { lat: dest[0],  lon: dest[1] },
        type: goal
    }

    const rsp = await fetch("/api/v1/route", { 
        method: "POST", 
        headers: commHeaders,
        body: JSON.stringify(req) 
    })
    const rspObj = await rsp.json() 

    return rspObj
}

export function transformRoute(routeData) {
    if (routeData == null || routeData.geometry.length === 0) return null;
    let points = [];
    
    routeData.geometry[0].forEach(point => {
        points.push([point.lat, point.lon])
    });

    return points;
}

export async function calculateVehicles(distance, occupants) {
    const req = {
        distance: distance,
        occupants: occupants
    }

    const rsp = await fetch("/api/v1/route/vehicles", { 
        method: "POST", 
        headers: commHeaders,
        body: JSON.stringify(req) 
    })
    const rspObj = await rsp.json() 

    return rspObj
}

export async function getArchivedMeta() {
    const rsp = await fetch("/api/v1/route/archive")
    const rspObj = await rsp.json() 

    return rspObj
}

export async function archiveMeta({src, dest, occupants}) {
    const req = {
        src: { lat: src[0], lon: src[1] },
        dest: { lat: dest[0], lon: dest[1] },
        occupants: occupants
    }

    const rsp = await fetch("/api/v1/route/archive", { 
        method: "POST", 
        headers: commHeaders,
        body: JSON.stringify(req) 
    })
    const rspObj = await rsp.json() 

    return rspObj.meta_id
}

export async function archiveRoute(metaId, result) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}`, { 
        method: "PUT", 
        headers: commHeaders,
        body: JSON.stringify(result) 
    })
    const rspObj = await rsp.json() 

    return rspObj.route_id
}

export async function archiveVehicles(metaId, routeId, rawVehicles) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}/${routeId}/vehicles`, { 
        method: "PUT", 
        headers: commHeaders,
        body: JSON.stringify(rawVehicles) 
    })
    const rspObj = await rsp.json() 

    return rspObj
}

export async function getArchivedRoutes(metaId) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}`)
    return await rsp.json()
}

export async function getArchivedVehicles(metaId, routeId) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}/${routeId}/vehicles`)
    return await rsp.json()
}
