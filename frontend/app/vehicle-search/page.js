'use client'
import { useState, useEffect, createElement } from 'react';
import { Alert, Modal, Box, Button, Stack, TextField, Typography } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import{v4 as uuidv4} from 'uuid';

function pingApi(setSearchData, setCurrentVehAmount) {
    fetch("/api/v1/getjoinedvehicle").then((rsp) => {
        rsp.json().then((obj) => {
            setSearchData(obj);
            setCurrentVehAmount(obj.length);
            console.log(obj)
          })
    }).catch((err) => {
      console.log(`Could not ping API - ${err}`)
    })
  }


const SearchPage = () => {
    const[searchData, setSearchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVehAmount, setCurrentVehAmount] = useState(0);
  const [userAlerts, setUserAlerts] = useState({});
  const [totalUserAttacks, setTotalUserAlerts] = useState(0);
  useEffect(()=> {pingApi(setSearchData, setCurrentVehAmount)}, [])
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleItemClick = (license) => {
    console.log('click successful for item with id:', license);
    fetch(`/api/v1/deletevehicle?rh=${license}`).then((rsp) => {
        rsp.json().then((obj) => {
          })
    }).catch((err) => {
      console.log(`Could not ping API - ${err}`)
    })
    pingApi(setSearchData, setCurrentVehAmount)
    addAlert("success", `${license} has been successfully removed from the database`);
  };

  const filteredData = searchData.filter((item) =>
    item.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <TextField
        label="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
            {filteredData.map((item) => (
          <Grid2 key={item.id} onClick={() => handleItemClick(item.license)}>
            <Grid2 xs={8}>
                <img src={item.image} alt={item.license} />
            </Grid2>
            <Grid2 xs={4}>
            <Grid2 xs={6}>
                    <Typography >{item.license}</Typography >
                </Grid2>
                <Grid2 xs={6}>
                    <Typography >{item.brand}</Typography >
                </Grid2>
                <Grid2 xs={2}>
                    <Typography>{item.model}</Typography >
                </Grid2>
                <Grid2 xs={2}>
                    <Typography >{item.emissions}</Typography >
                </Grid2>
                <Grid2 xs={2}>
                    <Typography>{item.capactiy}</Typography >
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

  );
};

export default SearchPage;