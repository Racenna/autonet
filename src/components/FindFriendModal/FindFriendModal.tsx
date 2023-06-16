import {
  Modal,
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  Button,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useGetAllUsersQuery } from "../../redux/services/user/userApi";
import { Spacer } from "../../shared/components/Spacer";
import { useAppSelector } from "../../redux/store";
import { toast } from "react-toastify";
import { useSendFriendRequestMutation } from "../../redux/services/friendRequest";
import { decodeJWT } from "../../utils/decodeJWT";
import { useGetFriendRequestsQuery } from "../../redux/services/friendRequest/friendRequestApi";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  maxHeight: 600,
  overflowY: "auto",
  p: 4,
};

export const FindFriendModal: FC<ModalProps> = ({ open, handleClose }) => {
  const { isLoading } = useGetAllUsersQuery();
  const { refetch: refetchSendedRequest } = useGetFriendRequestsQuery();

  const [
    sendFriendRequest,
    { isLoading: isFriendRequestLoading, isSuccess, isError },
  ] = useSendFriendRequestMutation();

  const usersList = useAppSelector((state) => state.user.listOfUsers);
  const sendedRequests = useAppSelector((state) => {
    const { UserId } = decodeJWT(localStorage.getItem("accessKey") ?? "");
    const senderRequests = state.user.listOfRequests.filter(
      (request) => request.senderId === Number(UserId)
    );
    return senderRequests;
  });

  useEffect(() => {
    refetchSendedRequest();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Request successfully sent");
      refetchSendedRequest();
    }
    if (isError) {
      toast.error("Request did not send");
    }
  }, [isFriendRequestLoading]);

  return (
    <Modal open={open} onClose={handleClose}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
          <Spacer height={8} />
          <Typography fontWeight="bold">Loading...</Typography>
        </Box>
      ) : (
        <Box sx={modalStyle}>
          {usersList.length === 0 ? (
            <Typography>Empty list</Typography>
          ) : (
            <List>
              {usersList.map((user) => {
                const isSent = sendedRequests.some(
                  (sended) => sended.receiverId === user.id
                );
                return (
                  <ListItem
                    key={user.id}
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          sendFriendRequest(user.id);
                        }}
                        disabled={isSent}
                      >
                        {isSent ? "Received" : "Send request"}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={user.profile.name}
                        src={user.profile.avatarImage}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.profile.name} ${user.profile.surname}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      )}
    </Modal>
  );
};
