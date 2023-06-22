import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Modal,
  IconButton,
} from "@mui/material";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Path } from "../../const/enums";
import { useAppSelector } from "../../redux/store";

import styles from "./MessagePage.module.css";
import { Spacer } from "../../shared/components/Spacer";
import { IMessage, ISendMessage } from "../../redux/services/types/chat";
import { decodeJWT } from "../../utils/decodeJWT";
import { useLazyGetChatByIdQuery } from "../../redux/services/chat/chatApi";
import { FullScreenLoader } from "../../shared/components/FullscreenLoader";
import RouteIcon from "@mui/icons-material/Route";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import LZString from "lz-string";
import { toast } from "react-toastify";

import "./MapStyles.css";
import { useTranslation } from "react-i18next";

const modalStyle = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  height: "80%",
  overflowY: "auto",
  p: 4,
};

const DEFAULT_CENTER_INFO = {
  lat: 49.0266,
  lng: 31.4826,
};

const getGeolocation = (
  onSuccess: (obj: { lat: number; lng: number }) => void,
  onError: (obj: { lat: number; lng: number }) => void
) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("latitude:", latitude);
        console.log("longitude:", longitude);
        onSuccess({ lat: latitude, lng: longitude });
      },
      function (error) {
        onError(DEFAULT_CENTER_INFO);
        console.log("Cannot get geolocation:", error.message);
      }
    );
  } else {
    onError(DEFAULT_CENTER_INFO);
  }
};

const MessagePage: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY ?? "",
    libraries: ["places"],
  });
  const { t } = useTranslation();

  const [getChatById, { isSuccess, isError, isLoading }] =
    useLazyGetChatByIdQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const isAuth = useAppSelector((state) => state.user.isAuthorized);
  const activeChat = useAppSelector((state) => state.user.activeChat);
  const friend = useAppSelector((state) => {
    const tokenData = decodeJWT(localStorage.getItem("accessKey") ?? "");
    if (tokenData) {
      const { UserId } = tokenData;
      return Number(UserId) === state.user.activeChat?.chat.firstUserId
        ? state.user.activeChat?.chat.secondUser
        : state.user.activeChat?.chat.firstUser;
    }
  });

  // Map states
  const [shareIsOpen, setShareIsOpen] = useState(false);
  const [centerInfo, setCenterInfo] = useState<{ lat: number; lng: number }>(
    DEFAULT_CENTER_INFO
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [originValue, setOriginValue] = useState("");
  const [destinationValue, setDestinationValue] = useState("");

  const autocompleteOrigin = useRef<any>(null);
  const autocompleteDestination = useRef<any>(null);

  // chat states
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
    setTypingStatus(
      t("chat.isTyping", {
        name: userName,
      })
    );
    console.log(`User ${userName} is typing...`);

    setTimeout(() => {
      setTypingStatus(null);
    }, 5000);
  };

  useEffect(() => {
    localStorage.setItem("currentRoute", location.pathname);
    if (!isAuth) {
      navigate(Path.SIGN_IN);
    }
    if (chatId) {
      getChatById(chatId);
    }
  }, []);

  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.chat.messages);
      getGeolocation(
        (data) => setCenterInfo(data),
        (data) => setCenterInfo(data)
      );
    }
  }, [activeChat]);

  useEffect(() => {
    if (isSuccess) {
      setMessages(() => activeChat?.chat?.messages ?? []);
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
  }, [isSuccess]);

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

    const decodedToken = decodeJWT(localStorage.getItem("accessKey") ?? "");

    if (!decodedToken) return;

    const { UserId } = decodedToken;

    const message: ISendMessage = {
      SenderId: UserId,
      Message: newMessage,
      Time: new Date().toISOString(),
    };

    try {
      console.log("message:", message);
      console.log("hubConnection:", hubConnection);
      await hubConnection?.invoke(
        "SendMessage",
        Number(chatId) ?? Number(activeChat?.chat?.id),
        message.Message
      );
      setNewMessage("");
      setTypingStatus(null);
    } catch (error) {
      console.log("SignalR Send Error: ", error);
    }
  };

  if (isLoading || !isLoaded || !friend) return <FullScreenLoader />;

  const calculateRoute = async () => {
    if (originValue === "" || destinationValue === "") return;

    try {
      const directionService = new google.maps.DirectionsService();
      const result = await directionService.route({
        origin: originValue,
        destination: destinationValue,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      setDistance(result.routes[0].legs[0].distance?.text ?? "");
      setDuration(result.routes[0].legs[0].duration?.text ?? "");
      setCenterInfo(
        (result.routes[0].legs[0]?.start_location as any) ?? DEFAULT_CENTER_INFO
      );
    } catch (_error) {
      toast.error(t("error.calculateRoute"));
    }
  };

  const clearRoute = () => {
    setDirections(null);
    setDistance("");
    setDuration("");
    setOriginValue("");
    setDestinationValue("");
  };

  const shareDirections = async () => {
    const compressedObject = LZString.compressToBase64(
      JSON.stringify(directions)
    );

    if (!directions || !compressedObject) return;

    const decodedToken = decodeJWT(localStorage.getItem("accessKey") ?? "");

    if (!decodedToken) return;

    const { UserId } = decodedToken;

    const message: ISendMessage = {
      SenderId: UserId,
      Message: compressedObject,
      Time: new Date().toISOString(),
    };

    try {
      console.log("message:", message);
      console.log("hubConnection:", hubConnection);
      await hubConnection?.invoke(
        "SendMessage",
        Number(chatId) ?? Number(activeChat?.chat?.id),
        message.Message
      );
      // setNewMessage("");
      setTypingStatus(null);
      getGeolocation(
        (data) => setCenterInfo(data),
        (data) => setCenterInfo(data)
      );
      setShareIsOpen(false);
      setMap(null);
      clearRoute();
      autocompleteOrigin.current = null;
      autocompleteDestination.current = null;
    } catch (error) {
      console.log("SignalR Send Error: ", error);
      toast.error(t("error.shareRoute"));
    }
  };

  const transformMessageString = (message: IMessage) => {
    try {
      const decompressedString: google.maps.DirectionsResult | null =
        JSON.parse(LZString.decompressFromBase64(message.message));

      if (decompressedString !== null) {
        // decode is success
        return (
          <Box key={message.id}>
            <Typography fontWeight="bold">{message.senderName}</Typography>
            <Box display="flex" alignItems="center">
              <Typography>{t("chat.sharedRoute")}</Typography>
              <Spacer width={8} />
              <IconButton
                onClick={() => {
                  setShareIsOpen(true);
                  setDirections(decompressedString);
                  setDistance(
                    decompressedString.routes[0].legs[0].distance?.text ?? ""
                  );
                  setDuration(
                    decompressedString.routes[0].legs[0].duration?.text ?? ""
                  );
                  setOriginValue(
                    decompressedString.routes[0].legs[0].start_address
                  );
                  setDestinationValue(
                    decompressedString.routes[0].legs[0].end_address
                  );

                  setCenterInfo(
                    (decompressedString.routes[0].legs[0]
                      ?.start_location as any) ?? DEFAULT_CENTER_INFO
                  );
                }}
              >
                <RouteIcon />
              </IconButton>
            </Box>
          </Box>
        );
      } else {
        // decode is fail
        return (
          <Box key={message.id}>
            <Typography fontWeight="bold">
              {message.senderName ?? "NO_NAME:"}
            </Typography>
            <Typography>{t("chat.failedToDisplayRoute")}</Typography>
          </Box>
        );
      }
    } catch (error) {
      // if cannot decode string
      return (
        <Box key={message.id}>
          <Typography fontWeight="bold">
            {message.senderName ?? "NO_NAME:"}
          </Typography>
          <Typography>{message.message}</Typography>
        </Box>
      );
    }
  };

  return (
    <Box className={styles.container}>
      <Grid container spacing={1} direction="column" height={"100%"}>
        <Grid item xs={1} className={styles.titleBlock}>
          <Box alignSelf="flex-start">
            <Box className={styles.friendTitle}>
              <Avatar
                alt={friend.profile.name}
                src={friend.profile.avatarImage}
              />
              <Spacer width={8} />
              <Typography variant="h6">
                {friend.profile.name} {friend.profile.surname}
              </Typography>
            </Box>
            <Spacer width={8} />
            {typingStatus && (
              <Typography
                variant="subtitle2"
                color="GrayText"
                style={{ marginLeft: "50px" }}
              >
                {typingStatus}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid direction="column" item xs={10} className={styles.messageBlock}>
          {messages.map(transformMessageString)}
        </Grid>
        <Grid className={styles.inputBlock} item xs={1}>
          <TextField
            className={styles.inputField}
            fullWidth
            placeholder={t("chat.writeMessagePlaceholder") ?? ""}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleInputMessage(Number(chatId ?? activeChat?.chat?.id));
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            size="small"
          />
          <Button variant="contained" onClick={() => setShareIsOpen(true)}>
            {t("chat.share")}
          </Button>
          <Spacer width={8} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            {t("chat.send")}
          </Button>
        </Grid>
      </Grid>
      {shareIsOpen && (
        <Modal
          open={shareIsOpen}
          onClose={() => {
            clearRoute();
            setShareIsOpen(false);
          }}
        >
          <Box sx={modalStyle}>
            <Box
              position="absolute"
              top="5%"
              left="25%"
              p={2}
              bgcolor="#fff"
              zIndex={1}
            >
              <Box display="flex">
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteOrigin.current = autocomplete;
                  }}
                  onPlaceChanged={() => {
                    if (!autocompleteOrigin.current) return;
                    setOriginValue(
                      autocompleteOrigin.current.getPlace().formatted_address
                    );
                  }}
                >
                  <TextField
                    label={t("chat.origin")}
                    value={originValue}
                    size="small"
                    onChange={(e) => setOriginValue(e.target.value)}
                  />
                </Autocomplete>
                <Spacer width={8} />
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteDestination.current = autocomplete;
                  }}
                  onPlaceChanged={() => {
                    if (!autocompleteDestination.current) return;
                    setDestinationValue(
                      autocompleteDestination.current.getPlace()
                        .formatted_address
                    );
                  }}
                >
                  <TextField
                    label={t("chat.destination")}
                    value={destinationValue}
                    size="small"
                    onChange={(e) => setDestinationValue(e.target.value)}
                  />
                </Autocomplete>
                <Spacer width={8} />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={calculateRoute}
                >
                  {t("chat.calculate")}
                </Button>
                <Spacer width={8} />
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={clearRoute}
                >
                  X
                </Button>
              </Box>
              <Spacer height={8} />
              <Box display="flex">
                <Typography>{t("chat.distance", { distance })}</Typography>
                <Spacer width={64} />
                <Typography>{t("chat.duration", { duration })}</Typography>
                <Spacer width={64} />
                <Box display="flex" marginLeft="auto">
                  <Button
                    size="small"
                    variant="outlined"
                    style={{ justifySelf: "flex-end" }}
                    onClick={() => map?.panTo(centerInfo)}
                  >
                    {t("chat.center")}
                  </Button>
                  <Spacer width={8} />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={shareDirections}
                    disabled={
                      !directions || (directions as any).status !== "OK"
                    }
                  >
                    {t("chat.sendDirection")}
                  </Button>
                </Box>
              </Box>
            </Box>
            <GoogleMap
              center={centerInfo}
              zoom={8}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map)}
            >
              {map && directions && (
                <DirectionsRenderer directions={directions} />
              )}
            </GoogleMap>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default MessagePage;
