import { CircularProgress, Box, Typography } from "@mui/material";
import { Spacer } from "./Spacer";

export const FullScreenLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
      <Spacer height={8} />
      <Typography fontWeight="bold">Loading...</Typography>
    </Box>
  );
};
