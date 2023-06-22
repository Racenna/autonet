import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";

import { Path } from "../../const/enums";
import { LinkButton } from "../../shared/components/LinkButton";
import { Spacer } from "../../shared/components/Spacer";

export const Error404 = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">{t("error.pageNotExist")}</Typography>
            <Spacer height={16} />
            <LinkButton path={Path.HOME} variant="contained">
              {t("backHome")}
            </LinkButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
