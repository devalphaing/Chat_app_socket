import React, { useEffect, useState, useRef } from "react";
import styles from "./ChatPage.module.css";
import { disconnect, sendMessage, socket, userJoined } from "../api/client";
import ting from '../media/ting.mp3';

//mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ChatPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [askName, setAskName] = useState(true);
  const nameInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleUserJoined = (name) => {
      console.log("new member joined", name);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user-joined", user: name, message: `${name} has joined!!` },
      ]);
    };

    const handleMessageReceive = (data) => {
      console.log(data, "receive");
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "message", user: data.name, message: data.message },
      ]);
    };

    const handleUserLeft = (name) => {
      console.log("member left", name);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user-joined", user: name, message: `${name} has left!!` },
      ]);
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("receive", handleMessageReceive);
    socket.on("user-left", handleUserLeft);

    // Cleanup function to remove the event listeners
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("receive", handleMessageReceive);
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "message", user: userName, message: inputValue },
    ]);
    sendMessage(inputValue);
    setInputValue(""); // Clear the input field after sending
    audioRef.current.play();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value.trim();
    if (enteredName) {
      setUserName(enteredName);
      userJoined(enteredName);
      setAskName(false);
    }
  };

  return (
    <>
      <Dialog
        open={askName}
        onClose={() => {}}
        PaperProps={{
          component: "form",
          onSubmit: handleFormSubmit,
        }}
        fullWidth
      >
        <DialogTitle>User Name</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your name:</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Your Name"
            fullWidth
            variant="standard"
            inputRef={nameInputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>

      <div className={styles["nav-bar"]}>Chat-App</div>

      <div className={styles["chat-container"]} ref={chatContainerRef}>
        {messages.map((data, index) => (
          <div
            key={index}
            className={
              data.type === "user-joined"
                ? styles["joined-msg"]
                : data.user === userName
                ? styles["my-msg"]
                : styles["other-msg"]
            }
          >
            {data.type === "user-joined"
              ? data.message
              : `${data.user} ~ ${data.message}`}
          </div>
        ))}
      </div>

      <div className={styles["enter-msg"]}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Enter message, ${userName}`}
        />
      </div>

      <div className={styles["btn"]}>
        <button onClick={handleSendClick}>Send</button>
      </div>

      <audio ref={audioRef} src={ting} />
    </>
  );
};

export default ChatPage;