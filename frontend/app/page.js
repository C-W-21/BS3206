'use client'

import { useEffect, useState } from "react";
import { Box, Button, Container, ThemeProvider } from "@mui/material";
import theme from "./theme";
import CommonLayout from "./commonLayout";

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
  const pageTitle = "Emissions Calculator";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pingApi();

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : (
      <CommonLayout title={pageTitle}>
      </CommonLayout>
      )}
    </ThemeProvider>
  );
}