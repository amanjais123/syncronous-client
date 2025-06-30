import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../constants/color";

const Home = () => {
  return (
    <Box
      bgcolor={grayColor}
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={2}
    >

    <div className="mb-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        />
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        />
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        />
      </svg>
    </div>
      <Typography variant="h4" color="textSecondary" gutterBottom>
        Welcome to Syncronous
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Select a chat to start messaging
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);
