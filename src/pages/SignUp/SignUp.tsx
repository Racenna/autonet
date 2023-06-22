import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkButton } from "../../shared/components/LinkButton";
import { Path } from "../../const/enums";
import { Gender } from "../../redux/services/types/user";
import { useRegisterUserMutation } from "../../redux/services/auth";
import { registerSchema, RegisterInput } from "../../validators/signUp";
import { useAppSelector } from "../../redux/store";
import { isAuthorized } from "../../utils/isAuthorized";

export const SignUp = () => {
  const [registerUser, { isLoading, isError, error, isSuccess }] =
    useRegisterUserMutation();
  const isAuth = useAppSelector((state) => state.user.isAuthorized);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = methods;

  useEffect(() => {
    if (isAuth && isAuthorized()) {
      navigate(Path.HOME);
    }
  }, [isAuth]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("toast.successRegister"), {
        position: "top-center",
      });
      navigate(Path.SIGN_IN);
    }
    if (isError) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    const { login, password, birthday, email, firstName, lastName, gender } =
      values;
    registerUser({
      Login: login,
      Password: password,
      Profile: {
        Avatarimage: "",
        Birthday: birthday.toISOString(),
        Description: "",
        Email: email,
        Name: firstName,
        Surname: lastName,
        sex: gender as Gender,
      },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("auth.signUp")}
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
                  required
                  fullWidth
                  id="firstName"
                  label={t("auth.firstName")}
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ""}
                  {...register("firstName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
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
                  required
                  fullWidth
                  id="login"
                  label={t("auth.login")}
                  autoComplete="login"
                  error={!!errors.login}
                  helperText={errors.login ? errors.login.message : ""}
                  {...register("login")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("auth.email")}
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  {...register("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
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
                <TextField
                  required
                  fullWidth
                  label={t("auth.passwordConfirm")}
                  type="password"
                  id="passwordConfirm"
                  error={!!errors.passwordConfirm}
                  helperText={
                    errors.passwordConfirm ? errors.passwordConfirm.message : ""
                  }
                  {...register("passwordConfirm")}
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
                            required: true,
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {t("auth.signUp")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <LinkButton path={Path.SIGN_IN}>
                  {t("auth.alreadyHaveAccount")}
                </LinkButton>
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};
