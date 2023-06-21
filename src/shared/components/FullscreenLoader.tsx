import { CircularProgress, Box, Typography } from "@mui/material";
import { Spacer } from "./Spacer";

export const FullScreenLoader = ({ fullScreen }: { fullScreen?: boolean }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={fullScreen ? "100vh" : "100%"}
    >
      <CircularProgress />
      <Spacer height={8} />
      <Typography fontWeight="bold">Loading...</Typography>
    </Box>
  );
};
