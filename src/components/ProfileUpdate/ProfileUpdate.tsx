import { toast } from "react-toastify";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Container,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, IUpdateProfile } from "../../redux/services/types/user";
import {
  updateProfileSchema,
  UpdateProfileInput,
} from "../../validators/updateProfile";

import { IUser } from "../../redux/services/types/user";

import styles from "./ProfileUpdate.module.css";
import { useAppDispatch } from "../../redux/store";
import { changeUpdateState } from "../../redux/user/userSlice";
import { ImageUploadAndCrop } from "../../shared/components/ImageUploadAndCrop";
import { useEffect, useState } from "react";
import { firebaseStorage } from "../../firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useUpdateProfileInfoMutation } from "../../redux/services/user";

export const ProfileUpdate = ({ user }: { user: IUser }) => {
  const [updateProfile, { isLoading, isSuccess, isError }] =
    useUpdateProfileInfoMutation();
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const methods = useForm<UpdateProfileInput>({
    defaultValues: {
      firstName: user.Profile.Name,
      lastName: user.Profile.Surname,
      birthday: new Date(user.Profile.Birthday),
      description: user.Profile.Description,
      avatar: user.Profile.Avatarimage,
      gender: user.Profile.sex,
    },
    resolver: zodResolver(updateProfileSchema),
  });

  const {
    register,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
    control,
    getValues,
  } = methods;

  const [isUpload, setIsUpload] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const handleCancelUpdate = () => {
    reset();
    dispatch(changeUpdateState(false));
  };

  const onSubmitHandler: SubmitHandler<UpdateProfileInput> = (values) => {
    const {
      password,
      birthday,
      firstName,
      lastName,
      gender,
      avatar,
      description,
    } = values;

    const data: IUpdateProfile = {
      password: password || undefined,
      profile: {
        name: firstName || undefined,
        surname: lastName || undefined,
        birthday: birthday?.toISOString() || undefined,
        description: description || undefined,
        sex: gender || undefined,
      },
    };

    if (avatar && isImageChanged) {
      const imageName = `image_${v4()}.jpg`;
      const storageRef = ref(firebaseStorage, `images/${imageName}`);
      uploadString(storageRef, avatar, "data_url")
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((avatarUrl) => {
              data.profile.avatarImage = avatarUrl;
              updateProfile(data)
                .then(() => toast.success("Profile data updated"))
                .catch(() => toast.error("Profile data did not update"));
            })
            .catch((error) =>
              console.error("error when try to get url:", error)
            );
        })
        .catch((error) => {
          console.error("upload image error:", error);
        });
    } else {
      updateProfile(data)
        .then(() => toast.success("Profile data updated"))
        .catch(() => toast.error("Profile data did not update"));
    }
  };

  useEffect(() => {
    if (isSuccess) handleCancelUpdate();
    if (isError) toast.error("Error while updating");
  }, [isSuccess]);

  return (
    <Box className={styles.container}>
      <Box className={styles.headerBlock}>
        <Typography component="h1" variant="h5">
          Update profile
        </Typography>
      </Box>
      <Box className={styles.contentBlock}>
        <Container maxWidth="xs">
          <Typography variant="caption" display="block" gutterBottom>
            * All fields are optional
          </Typography>
          <FormProvider {...methods}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmitHandler)}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    fullWidth
                    id="firstName"
                    label={t("auth.firstName")}
                    autoFocus
                    error={!!errors.firstName}
                    helperText={
                      errors.firstName ? errors.firstName.message : ""
                    }
                    {...register("firstName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label={t("auth.lastName")}
                    autoComplete="family-name"
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ""}
                    {...register("lastName")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("auth.password")}
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    {...register("password")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="birthday"
                    control={control}
                    render={({ field }) => {
                      return (
                        <DatePicker
                          label={t("auth.birthday")}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.birthday,
                              helperText: errors.birthday
                                ? errors.birthday.message
                                : "",
                            },
                          }}
                          value={new Date(field.value ?? "")}
                          onChange={(date: any) => field.onChange(date)}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    id="description"
                    label={t("auth.description")}
                    autoComplete="description"
                    error={!!errors.description}
                    helperText={
                      errors.description ? errors.description.message : ""
                    }
                    {...register("description")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <ImageUploadAndCrop
                    onUploadStart={() => setIsUpload(true)}
                    onSaveCropImage={(url) => {
                      setIsImageChanged(true);
                      setValue("avatar", url);
                      setIsUpload(false);
                    }}
                  />
                  {!isUpload && getValues("avatar") && (
                    <Box className={styles.croppedAvatar}>
                      <img src={getValues("avatar")} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={!!errors.gender} variant="standard">
                    <FormLabel id="radio-buttons-group-label">
                      {t("gender")}
                    </FormLabel>
                    <RadioGroup row aria-label="gender" {...register("gender")}>
                      <FormControlLabel
                        {...register("gender")}
                        value={Gender.Male}
                        control={<Radio />}
                        label={t("male")}
                      />
                      <FormControlLabel
                        {...register("gender")}
                        value={Gender.Female}
                        control={<Radio />}
                        label={t("female")}
                      />
                      <FormControlLabel
                        {...register("gender")}
                        value={Gender.Other}
                        control={<Radio />}
                        label={t("other")}
                      />
                    </RadioGroup>
                    <FormHelperText>
                      {errors.gender ? errors.gender.message : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                    onClick={handleCancelUpdate}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </Box>
  );
};
