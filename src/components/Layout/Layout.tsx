import { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Header } from "../Header";
import { Outlet } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";

import styles from "./Layout.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { FindFriendModal } from "../FindFriendModal";
import { useLazyGetFriendsListQuery } from "../../redux/services/friendship";
import {
  useLazyCreateChatQuery,
  useLazyGetAllChatsQuery,
} from "../../redux/services/chat";
import { decodeJWT } from "../../utils/decodeJWT";
import { IFriendWithChat } from "../../redux/services/types/chat";
import { toast } from "react-toastify";
import { setActiveChat } from "../../redux/user/userSlice";
import { Path } from "../../const/enums";
import LZString from "lz-string";
import { useTranslation } from "react-i18next";

export const Layout = () => {
  const { t } = useTranslation();
  const [getFriendsList] = useLazyGetFriendsListQuery();
  const [getAllChats] = useLazyGetAllChatsQuery();
  const [
    createChat,
    { isSuccess: createChatSuccess, isLoading: createChatIsLoading },
  ] = useLazyCreateChatQuery();

  const isAuth = useAppSelector((state) => state.user.isAuthorized);
  const friendsAndTheirChats = useAppSelector((state) => {
    const decodedToken = decodeJWT(localStorage.getItem("accessKey") ?? "");

    if (!decodedToken) return [];

    const { UserId } = decodedToken;
    const chats = state.user.listOfChats;
    const friends = state.user.listOfFriends;

    const friendsWithChat: IFriendWithChat[] = friends.map((friend) => {
      const chat =
        chats.find(
          (chat) =>
            (Number(UserId) === chat.chat.firstUserId ||
              Number(UserId) === chat.chat.secondUserId) &&
            (friend.id === chat.chat.firstUserId ||
              friend.id === chat.chat.secondUserId)
        ) ?? null;
      return {
        friendInfo: friend,
        chat: chat,
      };
    });

    return friendsWithChat;
  });
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  useEffect(() => {
    if (
      location.pathname !== Path.SIGN_IN &&
      location.pathname !== Path.SIGN_UP
    )
      localStorage.setItem("currentRoute", location.pathname);
  }, []);

  useEffect(() => {
    if (isAuth) {
      getFriendsList();
      getAllChats();
      const interval = setInterval(() => {
        getFriendsList();
        getAllChats();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAuth]);

  useEffect(() => {
    if (createChatSuccess) {
      toast.success(t("chat.created"));
    }
  }, [createChatIsLoading]);

  const getLastMessage = (message: string) => {
    try {
      const decompressedString = JSON.parse(
        LZString.decompressFromBase64(message)
      );

      if (decompressedString !== null) {
        return t("chat.sharedRoute");
      } else {
        return t("chat.failedToDisplayMessage");
      }
    } catch (error) {
      return message;
    }
  };

  return (
    <Box height="100%">
      <Header />
      <Box className={styles.container}>
        {isAuth && (
          <Box className={styles.asideContainer} component="aside">
            <Box>
              <List
                dense
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  backgroundColor: "transparent",
                }}
              >
                {friendsAndTheirChats.map((friendWithChat) => {
                  const labelId = `checkbox-list-secondary-label-${friendWithChat.friendInfo.id}`;
                  return (
                    <ListItem key={friendWithChat.friendInfo.id} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (!friendWithChat.chat) {
                            // create chat
                            createChat(friendWithChat.friendInfo.id);
                            getFriendsList();
                            getAllChats();
                          } else {
                            dispatch(setActiveChat(friendWithChat.chat));
                            navigate(
                              `/messages/${friendWithChat.chat.chat.id}`
                            );
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={friendWithChat.friendInfo.profile.name}
                            src={friendWithChat.friendInfo.profile.avatarImage}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          id={labelId}
                          primary={`${friendWithChat.friendInfo.profile.name} ${friendWithChat.friendInfo.profile.surname}`}
                          secondary={
                            !friendWithChat.chat
                              ? t("chat.createChatWith", {
                                  name: friendWithChat.friendInfo.profile.name,
                                })
                              : getLastMessage(
                                  friendWithChat.chat?.lastMessage?.message ??
                                    ""
                                )
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            <Box display="flex" justifyContent="center" marginTop="auto">
              <Tooltip title={t("chat.findDriver")}>
                <IconButton
                  color="primary"
                  aria-label="delete"
                  size="large"
                  onClick={handleOpenModal}
                >
                  <AddCircleOutlineIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
        <Box height="100%" width="100%">
          <Outlet />
        </Box>
      </Box>
      {open && <FindFriendModal open={open} handleClose={handleCloseModal} />}
    </Box>
  );
};
