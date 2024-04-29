'use client'

import { useEffect } from "react";
import { Box, Button, Container, ThemeProvider } from "@mui/material";
import theme from "../theme";
import LoginLayout from "../loginLayout";


export default function Login() {
    const pageTitle = "Login";
  
    return (
      <ThemeProvider theme={theme}>
        <LoginLayout title={pageTitle}>
        </LoginLayout>
      </ThemeProvider>
    );
  }