'use client'

import { useEffect, useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography, ThemeProvider } from "@mui/material";
import theme from "../theme";
import CommonLayout from "../commonLayout";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import "leaflet-defaulticon-compatibility"
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

async function planRoute(src, dest, goal) {
    const req = {
        src: {
            lat: src[0],
            lon: src[1]
        },
        dest: {
            lat: dest[0],
            lon: dest[1]
        },
        type: goal
    }

    const rsp = await fetch("/api/v1/route", { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req) 
    })
    const rspObj = await rsp.json() 

    return rspObj
}

export default function Page() {
    const [mapCentre, setMapCentre] = useState([51.248587, -1.087913])
    const [mapZoom, setMapZoom] = useState(14)

    const [src, setSrc] = useState([51.248587, -1.087913])
    const [dest, setDest] = useState([51.407998, -0.776213])
    const [routes, setRoutes] = useState([])

    const calculateRoute = async () => {
        const targetRoutes = [
            { goal: "balanced", colour: "blue" },
            { goal: "less_maneuvers", colour: "red" },
            { goal: "short", colour: "green" }
        ]

        var bbox = [[null, null], [null, null]]
        for (let i = 0; i < targetRoutes.length; i++) {
            const routeData = await planRoute(src, dest, targetRoutes[i].goal)
            console.log(routeData)
            if (routeData.results.length === 0) return;
            if (routeData.results[0].geometry.length === 0) return;
            let points = [];
            
            routeData.results[0].geometry[0].forEach(point => {
                points.push([point.lat, point.lon])
                if (bbox[0][0] === null || point.lat < bbox[0][0]) bbox[0][0] = point.lat;
                if (bbox[0][1] === null || point.lat > bbox[0][1]) bbox[0][1] = point.lat;
                if (bbox[1][0] === null || point.lon < bbox[1][0]) bbox[1][0] = point.lon;
                if (bbox[1][1] === null || point.lon > bbox[1][1]) bbox[1][1] = point.lon;
            });

            targetRoutes[i].positions = points;
        }
        
        console.log(targetRoutes)
        setRoutes(targetRoutes);

        const midPoint = (min, max) => {return min + ((max - min) / 2)}
        const centre = [midPoint(bbox[0][0], bbox[0][1]), midPoint(bbox[1][0], bbox[1][1])]
        setMapCentre(centre)
        console.log(centre)
    }

    return (
        <ThemeProvider theme={theme}>
            <CommonLayout>
                <Stack spacing={2} sx={{ height: 1, width: 1 }}>
                    <Stack direction="row" padding={2}>
                        <Button href="/" variant="contained">Home</Button>
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
                        <Stack spacing={2} sx={{ height: 1 }}>
                            <Typography variant="h3">Plan Route</Typography>
                            <Typography variant="h5">Source</Typography>
                            <TextField label="Latitude" value={src[0]} />
                            <TextField label="Longitude" value={src[1]} />
                            <Typography variant="h5">Destination</Typography>
                            <TextField label="Latitude" value={dest[0]} />
                            <TextField label="Longitude" value={dest[1]} />
                            <Typography variant="h5">Info</Typography>
                            <TextField label="Occupants" defaultValue="test" />
                            <Box flexGrow={1} />
                            <Button variant="contained" onClick={calculateRoute}>Calculate</Button>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Box sx={{ height: 1, width: 1 }}>
                            <MapContainer center={mapCentre} zoom={mapZoom} style={{ height: '100vh', width: '100wh' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                { src.length === 2 && <Marker position={src}><Popup>Source</Popup></Marker> }
                                { dest.length === 2 && <Marker position={dest}><Popup>Destination</Popup></Marker> }
                                { routes.map((route, i) => { return <Polyline key={i} positions={route.positions} color={route.colour} /> }) }
                            </MapContainer>
                        </Box>
                    </Stack>
                </Stack>
            </CommonLayout>
        </ThemeProvider>
    )
}

function historicRoutesPopover() {

}

function routeInfoPopover() {
    
}
