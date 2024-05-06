'use client'
import { useState, useEffect, createElement } from 'react';
import { useSearchParams } from 'next/navigation'
import { Alert, Modal, Box, Button, CardMedia, Stack, TextField } from "@mui/material";
import LicensePlateInput from '../components/LicensePlateInput';
import{v4 as uuidv4} from 'uuid';

const CreateVehiclePage = () => {
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleEmissions, setVehicleEmissions] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [isLicensePlateInputVisible, setIsLicensePlateInputVisible] = useState(false);
  const [submittedLicensePlate, setLicensePlate] = useState('');
  const searchParams = useSearchParams()
  const [updatedBase64String, base64String] = useState('');
  const [userAlerts, setUserAlerts] = useState({});
  const [totalUserAttacks, setTotalUserAlerts] = useState(0);

  const search = searchParams.get('search')

  useEffect(()=> {
    console.log(search)
  if(search != null){
    fetch(`/api/v1/getvehiclebyid?rh=${search}`).then((rsp) => {
      rsp.json().then((obj) => {
        setVehicleBrand(obj[0].brand)
        setVehicleModel(obj[0].model)
        setVehicleEmissions(obj[0].emissions)
        setVehicleCapacity(obj[0].capacity)
          console.log(obj)
        })
  }).catch((err) => {
    console.log(`Could not ping API - ${err}`)
  })
  }})

  const toggleLicensePlateInput = () => {
    setIsLicensePlateInputVisible(!isLicensePlateInputVisible);
  };

  const addAlert = (severity, message, timeoutMs=3000) =>{
    const id = uuidv4();
    const addObj = userAlerts;
    addObj [id] = createElement(Alert, {
        id: id,
        key: id,
        severity: severity,
        children: message
    });
    setUserAlerts(addObj);
    setTotalUserAlerts(currVal => currVal +1);

    setTimeout(() => {
        setUserAlerts(currObj =>{
                    delete currObj[id];
        return currObj;
        });
        setTotalUserAlerts(currVal => currVal -1);
    }, timeoutMs);
  }

  const handleLicensePlateSubmit = async (text) => {
    setLicensePlate(text);
    console.log('Submitted text:', text);
    const req = [text, search]
    const rsp = await fetch("/api/v1/createvehicle", { 
      method: "POST", 
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(req) 
  })
  const rspObj = await rsp.json() 

  console.log('New details successfully uploaded to the database!');
  addAlert("success", `${text} has been created in the database`);
  return rspObj
  };

  const handleBrandChange = (event) => {
    setVehicleBrand(event.target.value);
  };

  const handleModelChange = (event) => {
    setVehicleModel(event.target.value);
  };

  const handleEmissionsChange = (event) => {
    setVehicleEmissions(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setVehicleCapacity(event.target.value);
  };

  const handleSubmit = async () => {
    
    console.log(updatedBase64String)

    const req = [null, vehicleBrand, vehicleModel, updatedBase64String, vehicleEmissions, vehicleCapacity]
    const rsp = await fetch("/api/v1/updatevehicle", { 
      method: "POST", 
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(req) 
  })
  const rspObj = await rsp.json() 

  console.log('New details successfully uploaded to the database!');
  addAlert("success", `Vehicle has been successfully created in the datasae.`);
  return rspObj
  };

  return (
    <Box 
    sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white'
    }}
    padding={4}
>
    <Stack spacing={2} sx={{ height: 1, width: 1 }}>
        <Stack direction="row" padding={2} sx={{ backgroundColor: 'darkgreen' }}>
            <Button href="/" variant="contained">Home</Button>
        </Stack>
        <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
            <Stack spacing={2} sx={{ height: 1 }}>
            <Button variant="text" onClick={handleSubmit} style={{ float: 'right' }}>Upload Details</Button>
        <TextField id="vehicleBrand" label="Vehicle Brand" type="text" value={vehicleBrand} onChange={handleBrandChange} />
        <TextField id="vehicleModel" label="Vehicle Model" type="text" value={vehicleModel} onChange={handleModelChange} />
        <TextField id="vehicleEmissions" label="Vehicle Emissions" type="text" value={vehicleEmissions} onChange={handleEmissionsChange} />
        <TextField id="vehicleCapacity" label="Vehicle Capacity"  type="text" value={vehicleCapacity} onChange={handleCapacityChange} />

        {(!search == null) && <Button onClick={toggleLicensePlateInput}>
        {isLicensePlateInputVisible ? 'Hide Text Input' : 'Show Text Input'}
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
  );
};

export default CreateVehiclePage;