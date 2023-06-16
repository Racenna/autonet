import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box, Typography } from "@mui/material";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate, useParams } from "react-router-dom";
import { Path } from "../../const/enums";
import { useAppSelector } from "../../redux/store";

import styles from "./MessagePage.module.css";
import { Spacer } from "../../shared/components/Spacer";
import { IMessage, ISendMessage } from "../../redux/services/types/chat";
import { decodeJWT } from "../../utils/decodeJWT";

const MessagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id: chatId } = useParams();
  const isAuth = useAppSelector((state) => state.user.isAuthorized);
  const activeChat = useAppSelector((state) => state.user.activeChat);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  const [typingStatus, setTypingStatus] = useState<string | null>(null);

  const handleReceiveMessage = (message: IMessage) => {
    console.log(`New message:`, { ...message });
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const handleTextTyping = (userName: string) => {
    setTypingStatus(`${userName} is typing...`);
    console.log(`User ${userName} is typing...`);

    setTimeout(() => {
      setTypingStatus(null);
    }, 3000);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate(Path.SIGN_IN);
    } else {
      setMessages(() => activeChat?.chat.messages ?? []);
      // Create connection SignalR Hub
      const createHubConnection = async () => {
        const connection = new HubConnectionBuilder()
          .withUrl(`${process.env.REACT_APP_BASE_URL}/chatHub`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: false,
            accessTokenFactory: () => localStorage.getItem("accessKey") ?? "",
          })
          .withAutomaticReconnect()
          .build();

        try {
          await connection.start();
          console.log("SignalR Connected");

          // Subscribe on receive message event
          connection.on("ReceiveMessage", handleReceiveMessage);

          // Event listener for typing
          connection.on("TextTyping", handleTextTyping);

          connection.on("SendMessage", () => {
            setTypingStatus(null);
          });

          connection.off("TextTyping", (userName) => {
            console.log("connection.OFF ->", userName);
          });
        } catch (error) {
          console.log("SignalR Connection Error: ", error);
        }

        setHubConnection(connection);
      };

      createHubConnection();

      // Unsubscribe from connection
      return () => {
        if (hubConnection) {
          hubConnection.off("TextTyping", handleTextTyping);
          hubConnection.off("ReceiveMessage", handleReceiveMessage);
          hubConnection.stop();
          console.log("SignalR Disconnected");
        }
      };
    }
  }, []);

  const handleInputMessage = async (chatId: number | string) => {
    if (!chatId) return;
    try {
      await hubConnection?.invoke("TextTyping", chatId);
    } catch (error) {
      console.log("SignalR Send Error: ", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage) return;
    const { UserId } = decodeJWT(localStorage.getItem("accessKey") ?? "");

    const message: ISendMessage = {
      SenderId: UserId,
      Message: newMessage,
      Time: new Date().toISOString(),
    };

    try {
      await hubConnection?.invoke(
        "SendMessage",
        chatId ?? activeChat?.chat.id,
        message.Message
      );
      setNewMessage("");
      setTypingStatus(null);
    } catch (error) {
      console.log("SignalR Send Error: ", error);
    }
  };

  return (
    <Box className={styles.container}>
      <Grid container spacing={2} direction="column" height={"100%"}>
        <Grid item xs={1} className={styles.titleBlock}>
          <Typography variant="h6">Friend name</Typography>
          <br />
          <Spacer width={8} />
          {typingStatus && (
            <Typography variant="subtitle2" color="GrayText">
              {typingStatus}
            </Typography>
          )}
        </Grid>
        <Grid direction="column" item xs={10} className={styles.messageBlock}>
          {messages.map((message) => (
            <Box key={message.id}>
              <Typography fontWeight="bold">
                {message.senderName ?? "NO_NAME:"}
              </Typography>
              <Typography>{message.message}</Typography>
            </Box>
          ))}
        </Grid>
        <Grid className={styles.inputBlock} item xs={1}>
          <TextField
            className={styles.inputField}
            fullWidth
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleInputMessage(Number(chatId ?? activeChat?.chat.id));
            }}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagePage;
