'use client';
import React, { useState, useEffect, createElement } from 'react';
import { Alert, Modal, Box, Button, Stack, TextField, Typography, ThemeProvider } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { v4 as uuidv4 } from 'uuid';
import Theme from "../theme";
import CommonLayout from "../commonLayout";

//Function to get the vehicles and their appropaite specifications from the database
function getSearchData(setSearchData, setCurrentVehAmount) {
    fetch("/api/v1/getjoinedvehicle").then((rsp) => {
        rsp.json().then((obj) => {
            setSearchData(obj);
            setCurrentVehAmount(obj.length);
            console.log(obj);
        });
    }).catch((err) => {
        console.log(`Could not ping API - ${err}`);
    });
}

const SearchPage = () => {
    //Constants defining search data and terms for filtering of vehicles
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    //Constant for monitoring vehicle amount to assist tiggering vehicle list refresh when one is deleted
    const [currentVehAmount, setCurrentVehAmount] = useState(0);
    //Constants for displaying messages to the user
    const [userAlerts, setUserAlerts] = useState({});
    const [totalUserAttacks, setTotalUserAlerts] = useState(0);
    
    //Function to trigger retreival of vehicles on page load
    useEffect(() => {
        getSearchData(setSearchData, setCurrentVehAmount);
    }, []);
  
    //Function to trigger search filtering when user changes the search parameters in the search bar
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    //Method to handle deletion of vehicle from database and refresh of displayed vehicles when one is selected
    const handleItemClick = async (license) => {
        console.log('click successful for item with id:', license);
        await fetch(`/api/v1/updatevehicle?rh=${license}`, { 
            method: "DELETE", 
        }).then((rsp) => {
            rsp.json().then((obj) => {
            });
        }).catch((err) => {
            console.log(`Could not ping API - ${err}`);
        });
        getSearchData(setSearchData, setCurrentVehAmount);
        addAlert("success", `${license} has been successfully removed from the database`);
    };

    //Method which holds the current list of filtered data based on the input in the search bar from the user
    const filteredData = searchData.filter((item) =>
        item.license.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Method to set message display parameters for this page
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

    //Defines the look of the application and which componants are displayed 
    return (
        <ThemeProvider theme={Theme}>
            <CommonLayout title="Vehicle Search">
                <Box sx={{ height: '100%', width: '100%' }}>
                    <Stack spacing={2} sx={{ height: 1, width: 1 }}>
                        <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
                            <Stack spacing={2} sx={{ height: 1 }}>
                                <TextField
                                    label="Search..."
                                    value={searchTerm}
                                    onChange={handleChange}
                                />
                                {/*Defines the look of the clickable items*/}
                                {filteredData.map((item) => (
                                    <Grid2 key={item.license} onClick={() => handleItemClick(item.license)}>
                                        <Grid2 xs={4}>
                                            <Grid2 xs={6}>
                                                <Typography>{item.license}</Typography>
                                            </Grid2>
                                            <Grid2 xs={6}>
                                                <Typography>{item.brand}</Typography>
                                            </Grid2>
                                            <Grid2 xs={2}>
                                                <Typography>{item.model}</Typography>
                                            </Grid2>
                                            <Grid2 xs={2}>
                                                <Typography>{item.emissions}</Typography>
                                            </Grid2>
                                            <Grid2 xs={2}>
                                                <Typography>{item.capactiy}</Typography>
                                            </Grid2>
                                        </Grid2>
                                    </Grid2>
                                ))}
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

export default SearchPage;
