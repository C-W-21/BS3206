'use client'

import { useEffect } from "react";
import { Box, Button, Container } from "@mui/material";

// Check connectivity to API
function pingApi() {
  fetch("/api/v1/ping").then((rsp) => {
      if (rsp.status === 200) {
        rsp.json().then((obj) => {
          console.log(obj)
        })
      } else {
        console.log(`Could not ping API, recieved code ${rsp.status}`)
      }
  }).catch((err) => {
    console.log(`Could not ping API - ${err}`)
  })
}

export default function Home() {
  // Check API connectivity on page load
  useEffect(pingApi, [])

  return (
    <Box 
      sx={{
        height: '100vh',
        wodth: '100vw',
        backgroundColor: 'darkgreen'
      }}
    >
      <Button href="/route" variant="contained">Plan Route</Button>
    </Box>
  );
}
