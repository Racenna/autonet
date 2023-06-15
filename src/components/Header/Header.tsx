import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { SwitchLanguage } from "../SwitchLanguage";

export const Header = () => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Project Name
        </Typography>
        <nav></nav>
        <Box display="none">
          <SwitchLanguage />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
