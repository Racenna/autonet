import { CircularProgress, Box, Typography } from "@mui/material";
import { Spacer } from "./Spacer";
import { useTranslation } from "react-i18next";

export const FullScreenLoader = ({ fullScreen }: { fullScreen?: boolean }) => {
  const { t } = useTranslation();
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
      <Typography fontWeight="bold">{t("loading")}</Typography>
    </Box>
  );
};
