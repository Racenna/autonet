import { Box, Grid, Avatar, Typography, Button } from "@mui/material";
import { IUser } from "../../redux/services/types/user";

import styles from "./ProfileInfo.module.css";
import { Spacer } from "../../shared/components/Spacer";
import { useAppDispatch } from "../../redux/store";
import { changeUpdateState } from "../../redux/user/userSlice";

export const ProfileInfo = ({ user }: { user: IUser }) => {
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
            <b>Email: </b>
            {user.Profile.Email}
          </Typography>
          <Typography>
            <b>Birthday: </b>
            {user.Profile.Birthday}
          </Typography>
          <Typography>
            <b>Description: </b>
            {user.Profile.Description}
          </Typography>
          <Typography>
            <b>Gender: </b>
            {user.Profile.sex}
          </Typography>
        </Grid>
        <Grid item className={styles.inputBlock}>
          <Button
            variant="contained"
            onClick={() => dispatch(changeUpdateState(true))}
          >
            Update profile info
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
