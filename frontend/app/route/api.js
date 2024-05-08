const commHeaders = {
    "Content-Type": "application/json"
}

// Generate new route
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

// Extract raw coordinates to form line on screen
export function transformRoute(routeData) {
    if (routeData == null || routeData.geometry.length === 0) return null;
    let points = [];
    
    routeData.geometry[0].forEach(point => {
        points.push([point.lat, point.lon])
    });

    return points;
}

// Calculate best vehicles to use for route
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

// Retrieve all saved metadata
export async function getArchivedMeta() {
    const rsp = await fetch("/api/v1/route/archive")
    const rspObj = await rsp.json() 

    return rspObj
}

// Save metadata
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

// Save route associated to metadata
export async function archiveRoute(metaId, result) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}`, { 
        method: "PUT", 
        headers: commHeaders,
        body: JSON.stringify(result) 
    })
    const rspObj = await rsp.json() 

    return rspObj.route_id
}

// Save vehicles associated to a route and metadata
export async function archiveVehicles(metaId, routeId, rawVehicles) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}/${routeId}/vehicles`, { 
        method: "PUT", 
        headers: commHeaders,
        body: JSON.stringify(rawVehicles) 
    })
    const rspObj = await rsp.json() 

    return rspObj
}

// Get saved routes associated with a metadata entry
export async function getArchivedRoutes(metaId) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}`)
    return await rsp.json()
}

// Get saved vehicles associated with a route and metadata entry
export async function getArchivedVehicles(metaId, routeId) {
    const rsp = await fetch(`/api/v1/route/archive/${metaId}/${routeId}/vehicles`)
    return await rsp.json()
}
