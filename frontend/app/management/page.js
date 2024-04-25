'use client'
import { useState } from 'react';
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";

const CreateVehiclePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleEmissions, setVehicleEmissions] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
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
    const rsp = await fetch("/api/v1/updatevehicle", { 
      method: "POST", 
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(req) 
  })
  const rspObj = await rsp.json() 

  return rspObj
    console.log('New details successfully uploaded to the database!');
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
            <TextField type="file" accept="image/*" onChange={handleImageChange} />
        {selectedImage && <img src={selectedImage} alt="Selected Vehicle" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
        <TextField id="vehicleModel" label="Vehicle Model" type="text" value={vehicleModel} onChange={handleModelChange} />
        <TextField id="vehicleEmissions" label="Vehicle Emissions" type="text" value={vehicleEmissions} onChange={handleEmissionsChange} />
        <TextField id="vehicleCapacity" label="Vehicle Capacity"  type="text" value={vehicleEmissions} onChange={handleCapacityChange} />
            </Stack>
        </Stack>
    </Stack>
</Box>
  );
};

export default CreateVehiclePage;