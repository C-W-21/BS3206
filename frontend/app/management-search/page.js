'use client'
import { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography, ThemeProvider } from "@mui/material";
import Link from 'next/link';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Theme from "../theme";
import CommonLayout from "../commonLayout"

function pingApi(setSearchData) {
    fetch("/api/v1/updatevehicle").then((rsp) => {
        rsp.json().then((obj) => {
            setSearchData(obj);
            console.log(obj)
          })
    }).catch((err) => {
      console.log(`Could not ping API - ${err}`)
    })
  }


const SearchPage = () => {
    const[searchData, setSearchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(()=> {pingApi(setSearchData)}, [])
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (id) => {
    console.log('click successful for item with id:', id);
  };

  const filteredData = searchData.filter((item) =>
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<ThemeProvider theme={Theme}>
  <CommonLayout title="Vehicle Specifications Search">
    <Box sx={{ height: '100%', width: '100%' }}>

    <Stack spacing={2} sx={{ height: 1, width: 1 }}>

        <Stack spacing={2} direction="row" sx={{ height: 1, width: 1 }}>
            <Stack spacing={2} sx={{ height: 1 }}>
            <TextField
        label="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
            {filteredData.map((item) => (
          <Grid2 key={item.id} onClick={() => handleItemClick(item.id)}>
            <Link href={`/management?search=${item.id}`}>
            <Grid2 xs={8}>
                <img src={item.image} alt={item.brand} />
            </Grid2>
            <Grid2 xs={4}>
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
            </Link>
          </Grid2>
        ))}
            </Stack>
        </Stack>
    </Stack>
</Box>
  </CommonLayout>
</ThemeProvider>
  );
};

export default SearchPage;