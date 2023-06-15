import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useTranslation } from "react-i18next";
import { LinkButton } from "../../shared/components/LinkButton";
import { Path } from "../../const/enums";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/services/auth";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { LoginInput, loginSchema } from "../../validators/signIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

export const SignIn = () => {
  const [loginUser, { isLoading, isError, error, isSuccess }] =
    useLoginUserMutation();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const methods = useForm<LoginInput>({
    defaultValues: { rememberMe: false },
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("toast.successLogin"), {
        position: "top-center",
      });
      navigate("/");
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

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    const { login, password } = values;

    loginUser({
      Login: login,
      Password: password,
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
          {t("auth.signIn")}
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmitHandler)}
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label={t("auth.login")}
              autoComplete="login"
              autoFocus
              error={!!errors.login}
              helperText={errors.login ? errors.login.message : ""}
              {...register("login")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("auth.password")}
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              {...register("password")}
            />
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label={t("auth.rememberMe")}
              {...register("rememberMe")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("auth.signIn")}
            </Button>
            <Grid container>
              <Grid item xs>
                <LinkButton path={Path.SIGN_UP}>
                  {t("auth.haveNotAccount")}
                </LinkButton>
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};
