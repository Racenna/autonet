import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Popover,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { SwitchLanguage } from "../SwitchLanguage";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logout } from "../../redux/user/userSlice";
import { useNavigate } from "react-router";
import { Path } from "../../const/enums";
import {
  useAcceptRequestMutation,
  useDeclineRequestMutation,
  useGetFriendRequestsQuery,
} from "../../redux/services/friendRequest";
import { decodeJWT } from "../../utils/decodeJWT";
import { toast } from "react-toastify";

export const Header = () => {
  const { refetch: refetchFriendRequests } = useGetFriendRequestsQuery();
  const [
    acceptRequest,
    {
      isSuccess: isAcceptSuccess,
      isError: isAcceptError,
      isLoading: isAcceptLoading,
    },
  ] = useAcceptRequestMutation();
  const [
    declineRequest,
    {
      isSuccess: isDeclineSuccess,
      isError: isDeclineError,
      isLoading: isDeclineLoading,
    },
  ] = useDeclineRequestMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuth = useAppSelector((state) => state.user.isAuthorized);
  const currentUser = useAppSelector((state) => state.user.user);
  const receivedRequests = useAppSelector((state) => {
    const { UserId } = decodeJWT(localStorage.getItem("accessKey") ?? "");
    return state.user.listOfRequests.filter(
      (request) => request.receiverId === Number(UserId)
    );
  });

  useEffect(() => {
    if (isAcceptSuccess) {
      toast.success("Friend request accepted");
      refetchFriendRequests();
    }
    if (isAcceptError) {
      toast.error("Friend request accept error");
    }
  }, [isAcceptLoading]);

  useEffect(() => {
    if (isDeclineSuccess) {
      toast.success("Friend request declined");
      refetchFriendRequests();
    }
    if (isDeclineError) {
      toast.error("Friend request decline error");
    }
  }, [isDeclineLoading]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorRequestEl, setAnchorRequestEl] = useState<null | HTMLElement>(
    null
  );

  const requestPopupIsOpen = Boolean(anchorRequestEl);
  const requestPopupId = requestPopupIsOpen ? "request-popover" : undefined;

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Social Network
        </Typography>
        {isAuth && currentUser && (
          <>
            <Box marginRight={1}>
              <IconButton
                size="large"
                color="inherit"
                onClick={(e) => setAnchorRequestEl(e.currentTarget)}
              >
                <Badge badgeContent={receivedRequests.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popover
                id={requestPopupId}
                open={requestPopupIsOpen}
                anchorEl={anchorRequestEl}
                onClose={() => setAnchorRequestEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box margin="16px 12px">
                  {receivedRequests.length === 0 && (
                    <Typography>You do not have any requests</Typography>
                  )}
                  {receivedRequests.map((request) => {
                    return (
                      <Box key={request.id} marginBottom={1}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography fontWeight="bold">
                              {request.sender.profile.name}{" "}
                              {request.sender.profile.surname}
                            </Typography>
                            <Typography>Sent you a friend request</Typography>
                          </CardContent>
                          <CardActions>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              width="100%"
                            >
                              <Button
                                fullWidth
                                size="small"
                                color="success"
                                onClick={() => acceptRequest(request.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                fullWidth
                                size="small"
                                color="error"
                                onClick={() => declineRequest(request.id)}
                              >
                                Decline
                              </Button>
                            </Box>
                          </CardActions>
                        </Card>
                      </Box>
                    );
                  })}
                </Box>
              </Popover>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ p: 0 }}
              >
                <Avatar
                  alt={currentUser.Profile.Name}
                  src={currentUser.Profile.Avatarimage}
                />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    dispatch(logout());
                    setAnchorEl(null);
                    navigate(Path.SIGN_IN);
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}

        <Box>
          <SwitchLanguage />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
