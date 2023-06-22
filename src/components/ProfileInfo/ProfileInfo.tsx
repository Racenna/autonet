import { Box, Grid, Avatar, Typography, Button } from "@mui/material";
import { IUser } from "../../redux/services/types/user";

import styles from "./ProfileInfo.module.css";
import { Spacer } from "../../shared/components/Spacer";
import { useAppDispatch } from "../../redux/store";
import { changeUpdateState } from "../../redux/user/userSlice";
import { useTranslation } from "react-i18next";

export const ProfileInfo = ({ user }: { user: IUser }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Box className={styles.container}>
      <Grid container spacing={2} direction="column" height="100%">
        <Grid item xs={1} className={styles.headerBlock}>
          <Avatar
            alt={user.Profile.Avatarimage}
            src={user.Profile.Avatarimage}
          />
          <Spacer width={16} />
          <Typography>
            {user.Profile.Name} {user.Profile.Surname}
          </Typography>
        </Grid>
        <Grid item className={styles.contentBlock}>
          <Typography>
            <b>{t("auth.email")}: </b>
            {user.Profile.Email}
          </Typography>
          <Typography>
            <b>{t("auth.birthday")}: </b>
            {user.Profile.Birthday}
          </Typography>
          <Typography>
            <b>{t("auth.description")}: </b>
            {user.Profile.Description}
          </Typography>
          <Typography>
            <b>{t("gender")}: </b>
            {user.Profile.sex}
          </Typography>
        </Grid>
        <Grid item className={styles.inputBlock}>
          <Button
            variant="contained"
            onClick={() => dispatch(changeUpdateState(true))}
          >
            {t("profile.updateInfo")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
