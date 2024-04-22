'use client'

import { useEffect } from "react";
import { Box, Button, Container, ThemeProvider } from "@mui/material";
import theme from "../styles/theme"; 

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
    <ThemeProvider theme={theme}>
      <Button href="/route" variant="contained">Plan Route</Button>
    </ThemeProvider>
  );
}
