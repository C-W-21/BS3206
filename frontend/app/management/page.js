'use client';
import React, { useState, useEffect, createElement } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, Modal, Box, Button, TextField, Stack, ThemeProvider } from "@mui/material";
import LicensePlateInput from '../components/LicensePlateInput';
import { v4 as uuidv4 } from 'uuid';
import Theme from "../theme";
import CommonLayout from "../commonLayout";

const CreateVehiclePage = () => {
    //Variables for setting specification details
    const [vehicleBrand, setVehicleBrand] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleEmissions, setVehicleEmissions] = useState(0);
    const [vehicleCapacity, setVehicleCapacity] = useState(0);
    //Variables for setting visibility of objects
    const [isLicensePlateInputVisible, setIsLicensePlateInputVisible] = useState(false);
    const [submittedLicensePlate, setLicensePlate] = useState('');
    //Variables for setting messages
    const [userAlerts, setUserAlerts] = useState({});
    const [totalUserAttacks, setTotalUserAlerts] = useState(0);
    //Variables for processing variables needed for database searches
    const searchParams = useSearchParams();
    const search = searchParams.get('search');

    //Function which will retrieve data from id and database on page launch if there is a search parameter
    useEffect(() => {
        console.log(search);
        if (search != null) {
            fetch(`/api/v1/getvehiclebyid?rh=${search}`).then((rsp) => {
                rsp.json().then((obj) => {
                    setVehicleBrand(obj[0].brand);
                    setVehicleModel(obj[0].model);
                    setVehicleEmissions(obj[0].emissions);
                    setVehicleCapacity(obj[0].capacity);
                    console.log(obj);
                });
            }).catch((err) => {
                console.log(`Could not ping API - ${err}`);
            });
        }
    }, []);

    //Function to set visibility of license plate textfield
    const toggleLicensePlateInput = () => {
        setIsLicensePlateInputVisible(!isLicensePlateInputVisible);
    };

    //Function to define parameters for displayed messages
    const addAlert = (severity, message, timeoutMs = 3000) => {
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
            setTotalUserAlerts(currVal => currVal - 1);
        }, timeoutMs);
    };

    //Function to call API/Database to create a new vehicle in the vehicles table
    const handleLicensePlateSubmit = async (text) => {
        setLicensePlate(text);
        console.log('Submitted text:', text);
        const req = [text, search];
        const rsp = await fetch("/api/v1/createvehicle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        });

        console.log('New details successfully uploaded to the database!');
        addAlert("success", `${text} has been created in the database`);
    };

    //Function to handle when the Brand Textfield is changed
    const handleBrandChange = (event) => {
        setVehicleBrand(event.target.value);
    };

    //Function to handle when the Model Textfield is changed
    const handleModelChange = (event) => {
        setVehicleModel(event.target.value);
    };

    //Function to handle when the Emsissions Textfield is changed
    const handleEmissionsChange = (event) => {
        setVehicleEmissions(event.target.value);
    };

    //Function to handle when the Capacity Textfield is changed
    const handleCapacityChange = (event) => {
        setVehicleCapacity(event.target.value);
    };

    //Function to call API/Database to create/update a vehicle specifications in the vehicle_specifications table
    const handleSubmit = async () => {
        const req = [search, vehicleBrand, vehicleModel, vehicleEmissions, vehicleCapacity];
        const rsp = await fetch("/api/v1/updatevehicle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        });
        const rspObj = await rsp.json();

        console.log('New details successfully uploaded to the database!');
        addAlert("success", `Vehicle has been successfully created in the database.`);
        return rspObj;
    };

    //Defines the look of the page and which controls are rendered
    return (
        <ThemeProvider theme={Theme}>
            <CommonLayout title="Create Vehicle">
                <Box sx={{ height: '100%', width: '100%' }}>
                    <Stack spacing={2} sx={{ height: 1, width: 1 }}>
                        <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
                            <Stack spacing={2} sx={{ height: 1 }}>
                                <Button variant="text" onClick={handleSubmit} style={{ float: 'right' }}>Upload Details</Button>
                                <TextField id="vehicleBrand" label="Vehicle Brand" type="text" value={vehicleBrand} onChange={handleBrandChange} />
                                <TextField id="vehicleModel" label="Vehicle Model" type="text" value={vehicleModel} onChange={handleModelChange} />
                                <TextField id="vehicleEmissions" label="Vehicle Emissions" type="text" value={isNaN(vehicleEmissions) ? "" : vehicleEmissions} onChange={handleEmissionsChange} />
                                <TextField id="vehicleCapacity" label="Vehicle Capacity" type="text" value={isNaN(vehicleCapacity) ? "" : vehicleCapacity} onChange={handleCapacityChange} />
                                {(search != null) && <Button onClick={toggleLicensePlateInput}>
                                    {isLicensePlateInputVisible ? 'Hide License Plate Input' : 'Show License Plate Input'}
                                </Button>}
                                {isLicensePlateInputVisible && <LicensePlateInput onSubmit={handleLicensePlateSubmit} />}
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
    );
};

export default CreateVehiclePage;
