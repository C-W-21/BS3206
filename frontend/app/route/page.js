'use client'

import { createElement, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Collapse, ThemeProvider, Divider, FormControlLabel, FormGroup, Grid, List, ListItem, ListItemText, MenuItem, Modal, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import "leaflet-defaulticon-compatibility"
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import Theme from "../theme";
import CommonLayout from "../commonLayout"

import {archiveMeta, archiveRoute, archiveVehicles, calculateVehicles, getArchivedMeta, getArchivedRoutes, getArchivedVehicles, planRoute, transformRoute} from "./api.js";
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    // Variables for displaying map
    const [routes, setRoutes] = useState([]);
    const mapRef = useRef(null);

    // User input variables
    const [src, setSrc] = useState([51.202905, -1.981359]);
    const [dest, setDest] = useState([51.209451, -1.977121]);
    const [occupants, setOccupants] = useState(0);
    const [saveId, setSaveId] = useState("");

    // Variables for managing UI
    const [showRouteInfo, setShowRouteInfo] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [userAlerts, setUserAlerts] = useState({});
    const [totalUserAlerts, setTotalUserAlerts] = useState([]);

    // Variables for storing data
    const [rawRoutes, setRawRoutes] = useState([]);
    const [rawVehicles, setRawVehicles] = useState([]);
    const [allRtMeta, setAllRtMeta] = useState([]);
    const [savedRtIds, setSavedRtIds] = useState([]);
    const [skipVehicleCalculate, setSkipVehicleCalculate] = useState(false);
    
    const getSavedRoutes = async () => {
        const rtMeta = await getArchivedMeta();
        setAllRtMeta(rtMeta);
        setSavedRtIds(rtMeta.map((meta) => String(meta.meta_id).padStart(6, "0")));
    };

    useEffect(() => { 
        getSavedRoutes();
        centreScreen(src, dest);
    }, []);
    useEffect(() => { getSavedRoutes() }, [canSave]);

    const centreScreen = (ptA, ptB) => {
        if (!mapRef.current) return;
        const border = 0.00001;
        let bbox = [
            [Math.min(ptA[0], ptB[0]), Math.min(ptA[1], ptB[1])], // sw lat,lon
            [Math.max(ptA[0], ptB[0]), Math.max(ptA[1], ptB[1])] // ne lat,lon
        ];
        bbox = [
            [bbox[0][0] - Math.abs(bbox[0][0] * border), bbox[0][1] - Math.abs(bbox[0][1] * border)],
            [bbox[1][0] + Math.abs(bbox[1][0] * border), bbox[1][1] + Math.abs(bbox[1][1] * border)]
        ];
        mapRef.current.fitBounds(bbox);
    }

    const addAlert = (severity, message, timeoutMs=3000) => {
        const id = uuidv4();
        const addObj = userAlerts;
        addObj[id] = createElement(Alert, {
            id: id,
            key: id,
            severity: severity,
            children: message
        });
        setUserAlerts(addObj);
        setTotalUserAlerts(currVal => currVal + 1);

        setTimeout(() => {
            setUserAlerts(currObj => {
                delete currObj[id];
                return currObj;
            });
            setTotalUserAlerts(currVal => currVal - 1); // view does not update when item is just removed from userAlerts map so this is needed
        }, timeoutMs);
    };

    const calculateRoute = async (load) => {
        const targetRoutes = [
            { goal: "short", colour: "green", positions: [] },
            { goal: "less_maneuvers", colour: "red", positions: [] }
        ];

        var rawRouteData = [];
        if (load) {
            const archivedRoutes = await getArchivedRoutes(saveId);
            rawRouteData = archivedRoutes.results.sort((a, b) => a.distance - b.distance);
            let archivedVehicles = [];
            for (let i = 0; i < rawRouteData.length; i++) {
                archivedVehicles.push(await getArchivedVehicles(saveId, rawRouteData[i].id));

                const points = transformRoute(rawRouteData[i]);
                targetRoutes[i].positions = points;
            }
            setRawVehicles(archivedVehicles);
            setSkipVehicleCalculate(true);

            const metaInfo = allRtMeta.filter(e => e.meta_id === parseInt(saveId))[0];
            const waypoints = {
                src: [metaInfo.src.lat, metaInfo.src.lon],
                dest: [metaInfo.dest.lat, metaInfo.dest.lon]
            }
            setSrc(waypoints.src);
            setDest(waypoints.dest);
            setOccupants(metaInfo.occupants);
            centreScreen(waypoints.src, waypoints.dest);
        } else {
            for (let i = 0; i < targetRoutes.length; i++) {
                rawRouteData.push((await planRoute(src, dest, targetRoutes[i].goal)).results[0]);
                const points = transformRoute(rawRouteData[i]);
    
                targetRoutes[i].positions = points;
            }
            centreScreen(src, dest);
        }
        
        setRawRoutes(rawRouteData);
        setRoutes(targetRoutes.reverse());
        setCanSave(true);
    };

    const save = async () => {
        const metaId = await archiveMeta({src: src, dest: dest, occupants: occupants});
        for (let i = 0; i < rawRoutes.length; i++) {
            const routeId = await archiveRoute(metaId, rawRoutes[i]);
            await archiveVehicles(metaId, routeId, rawVehicles[i]);
        }
        setCanSave(false);
        addAlert("success", `This route has been saved under ID ${String(metaId).padStart(6, "0")}`);
    };

    const valid = {
        srcLat: () => !isNaN(src[0]),
        srcLon: () => !isNaN(src[1]),
        destLat: () => !isNaN(dest[0]),
        destLon: () => !isNaN(dest[1]),
        occupants: () => !isNaN(occupants) && occupants > 0
    };  

    const pageTitle = "Plan Route"

    return (
        <ThemeProvider theme={Theme}>
            <CommonLayout title={pageTitle}>    
                <Box 
                    sx={{
                        height: '100%',
                        width: '100%',
                    }}
                    padding={4}
                >
                    <Stack spacing={2} sx={{ height: 1, width: 1 }}>
                        <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
                            <Stack spacing={2} sx={{ height: 1 }}>
                                <Typography variant="h5" align="center">New Route</Typography>
                                <Typography>Source</Typography>
                                <TextField 
                                    label="Latitude" 
                                    size="small"
                                    value={isNaN(src[0]) ? "" : src[0]} 
                                    onChange={e => {
                                        setRoutes([]);
                                        setCanSave(false);
                                        setSrc([parseFloat(e.target.value), src[1]]);
                                    }}
                                    error={!valid.srcLat()}
                                />
                                <TextField 
                                    label="Longitude" 
                                    size="small"
                                    value={isNaN(src[1]) ? "" : src[1]} 
                                    onChange={e => {
                                        setRoutes([]);
                                        setCanSave(false);
                                        setSrc([src[0], parseFloat(e.target.value)]);
                                    }}
                                    error={!valid.srcLon()}
                                />
                                <Typography>Destination</Typography>
                                <TextField 
                                    label="Latitude" 
                                    size="small"
                                    value={isNaN(dest[0]) ? "" : dest[0]} 
                                    onChange={e => {
                                        setRoutes([]);
                                        setCanSave(false);
                                        setDest([parseFloat(e.target.value), dest[1]]);
                                    }}
                                    error={!valid.destLat()}
                                />
                                <TextField 
                                    label="Longitude" 
                                    size="small"
                                    value={isNaN(dest[1]) ? "" : dest[1]} 
                                    onChange={e => {
                                        setRoutes([]);
                                        setCanSave(false);
                                        setDest([dest[0], parseFloat(e.target.value)]);
                                    }}
                                    error={!valid.destLon()}
                                />
                                <Typography>Info</Typography>
                                <TextField 
                                    label="Occupants"
                                    size="small" 
                                    value={isNaN(occupants) ? "" : occupants} 
                                    onChange={e => setOccupants(Math.abs(parseInt(e.target.value)))} 
                                    error={!valid.occupants()}
                                />
                                <Button 
                                    variant="contained" 
                                    onClick={() => calculateRoute(false)} 
                                    size="small"
                                    disabled={!Object.values(valid).map(func => func()).every(Boolean)}
                                >Calculate</Button>

                                <Divider />

                                <Typography variant="h5" align="center">Saved Route</Typography>
                                <TextField
                                    label="Save ID"
                                    size="small"
                                    value={saveId}
                                    select
                                    onChange={e => setSaveId(e.target.value)}
                                >
                                    {savedRtIds.length > 0 && savedRtIds.map((id) =>
                                        <MenuItem key={id} value={id}>{id}</MenuItem>
                                    )}
                                </TextField>
                                
                                <Button 
                                    variant="contained" 
                                    onClick={() => calculateRoute(true)} 
                                    size="small" 
                                    disabled={saveId === ""}
                                >Load</Button>

                                <Divider />

                                <Box flexGrow={1} />
                                <Button 
                                    variant="contained" 
                                    size="small" 
                                    disabled={!(canSave && valid.occupants())}
                                    onClick={save}
                                >Save Route</Button>
                                <FormGroup>
                                    <FormControlLabel 
                                        control={
                                            <Switch 
                                                checked={showRouteInfo} 
                                                onChange={e => setShowRouteInfo(e.target.checked)}
                                                disabled={rawRoutes.length === 0}
                                            />
                                        }
                                        label="View Results"
                                    />
                                </FormGroup>
                            </Stack>
                            <Divider orientation="vertical"/>
                            <Stack direction="row" sx={{ height: 1, width: 1 }}>
                                <Box sx={{ height: 1, width: 1 }}>
                                    <MapContainer center={[51.207153, -1.976895]} zoom={15} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        { !isNaN(src[0]) && !isNaN(src[1]) && <Marker position={src}><Popup>Source</Popup></Marker> }
                                        { !isNaN(dest[0]) && !isNaN(dest[1]) && <Marker position={dest}><Popup>Destination</Popup></Marker> }
                                        { routes.map((route, i) => <Polyline key={i} positions={route.positions} color={route.colour} /> ) }
                                    </MapContainer>
                                </Box>
                                <Box flexGrow>
                                    <RouteInfoPopover 
                                        show={showRouteInfo} 
                                        occupants={occupants} 
                                        rawRoutes={rawRoutes} 
                                        vehicles={rawVehicles} 
                                        vehiclesSetter={setRawVehicles}
                                        skipCalculate={skipVehicleCalculate}
                                        setSkipCalculate={setSkipVehicleCalculate}
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Modal open={Object.keys(userAlerts).length > 0}>  
                        <Stack>
                            {Object.values(userAlerts)}
                        </Stack>
                    </Modal>
                </Box>
            </CommonLayout>
        </ThemeProvider>
    ) // TODO: make modal pretty 
}

function RouteInfoPopover({show, occupants, rawRoutes, vehicles, vehiclesSetter, skipCalculate, setSkipCalculate}) {
    const [viewRoute, setViewRoute] = useState(0);
    const [routeResults, setRouteResults] = useState([])

    // Get vehicles to use
    useEffect(() => {
        const getResultInfo = async () => {
            if (skipCalculate) {
                setSkipCalculate(false);
                return;
            }
            if (occupants <= 0 || isNaN(occupants)) return;

            let rawVehicles = []
            const sortedRoutes = rawRoutes.sort((a, b) => a.distance - b.distance)
            for (let i = 0; i < sortedRoutes.length; i++) {
                rawVehicles.push(await calculateVehicles(sortedRoutes[i].distance, occupants));
            }
            vehiclesSetter(rawVehicles);
        }
        getResultInfo();
    }, [rawRoutes, occupants])

    useEffect(() => {
        const sortedRoutes = rawRoutes.sort((a, b) => a.distance - b.distance)
        let newRoutes = []
        for (let i = 0; i < sortedRoutes.length; i++) {
            const distance = sortedRoutes[i].distance
            let seconds = sortedRoutes[i].time
            const journeyTime = {
                days: Math.floor(seconds / (24 * 60 * 60)),
                hours: 0,
                minutes: 0
            }
            seconds = seconds % (24 * 60 * 60)
            journeyTime.hours = Math.floor(seconds / (60 * 60))
            seconds = seconds % (60 * 60)
            journeyTime.minutes = Math.round(seconds / 60)

            newRoutes.push({
                info: {
                    "Distance": `${distance / 1000}km`,
                    "Time": `${journeyTime.days}d ${journeyTime.hours}h ${journeyTime.minutes}m`,
                    "Emissions": `${vehicles[i].emissions === null ? "N/A " : vehicles[i].emissions}kg CO2`,
                    "Occupants": occupants
                },
                vehicles: Object.entries(vehicles[i].vehicles).map(([licensePlate, details]) => ({
                    licensePlate: licensePlate,
                    emissions: details.emissions
                }))
            });
        }
        setRouteResults(newRoutes);
    }, [vehicles])

    return (
        <Collapse orientation="horizontal" in={show} style={{ position: "relative", right: 0 }}>
            <Box sx={{ width: 300 }}>
                <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
                    <Divider orientation="vertical" />
                    <Stack spacing={2} sx={{ height: 1, width: 1 }}>
                        <Typography variant="h5" align="center">Results</Typography>
                        <TextField label="Route" select value={viewRoute} onChange={e => setViewRoute(e.target.value)}>
                            <MenuItem value={0} sx={{ color: "green" }}>Efficient</MenuItem>
                            <MenuItem value={1} sx={{ color: "red" }}>Easy</MenuItem>
                        </TextField>
                        <Divider />
                        <Stack>
                            <Typography>Stats</Typography>
                            {routeResults[viewRoute] !== undefined && Object.entries(routeResults[viewRoute].info).map(([key, val], i) => 
                                <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" >
                                    <Typography>{key}:</Typography>
                                    <Typography>{val}</Typography>
                                </Stack>
                            )}
                        </Stack>
                        <Divider />
                        <Typography>Vehicles Used</Typography>
                        <Paper sx={{ width: 1, height: 300 }} style={{ overflowY: "auto", borderRadius: "10px" }}>
                            <List dense> 
                                {routeResults[viewRoute] !== undefined && routeResults[viewRoute].vehicles.map((vehicle, i) => [
                                    <ListItem key={i} style={{ borderRadius: "10px" }}>
                                        <ListItemText primary={vehicle.licensePlate} secondary={`${vehicle.emissions}kg CO2`} />
                                    </ListItem>,
                                    <Divider key={`${i}-DIV`} sx={{ mx: 1.5 }} />
                                ])} 
                                {routeResults[viewRoute] !== undefined && occupants > 0 && routeResults[viewRoute].vehicles.length === 0 && 
                                    <ListItem style={{ borderRadius: "10px" }}>
                                        <ListItemText primary="INSUFFICIENT VEHICLES. CHECK INVENTORY." sx={{ color: "red"}} />
                                    </ListItem>
                                } 
                            </List>
                        </Paper>
                    </Stack>
                </Stack>
            </Box>
        </Collapse>
    )
}
