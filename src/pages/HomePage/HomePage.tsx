import { Box } from "@mui/material";
import { useAppSelector } from "../../redux/store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Path } from "../../const/enums";
import { isAuthorized } from "../../utils/isAuthorized";

export const HomePage = () => {
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.user.isAuthorized);

  useEffect(() => {
    if (!isAuth || !isAuthorized()) navigate(Path.SIGN_IN);
  }, [isAuth]);

  return (
    <Box height={"100%"}>
      <Outlet />
    </Box>
  );
};
