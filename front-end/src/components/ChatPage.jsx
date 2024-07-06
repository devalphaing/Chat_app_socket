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
  // State variables to manage input, username, messages, and the username dialog
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [askName, setAskName] = useState(true);

  // Refs to manage focus and DOM elements
  const nameInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Function to handle when a user joins the chat
    const handleUserJoined = (name) => {
      console.log("new member joined", name);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user-joined", user: name, message: `${name} has joined!!` },
      ]);
    };

    // Function to handle receiving a message
    const handleMessageReceive = (data) => {
      console.log(data, "receive");
      audioRef.current.play(); // Play the notification sound
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "message", user: data.name, message: data.message },
      ]);
    };

    // Function to handle when a user leaves the chat
    const handleUserLeft = (name) => {
      console.log("member left", name);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user-joined", user: name, message: `${name} has left!!` },
      ]);
    };

    // Socket event listeners
    socket.on("user-joined", handleUserJoined);
    socket.on("receive", handleMessageReceive);
    socket.on("user-left", handleUserLeft);

    // Cleanup function to remove the event listeners when the component unmounts
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("receive", handleMessageReceive);
      socket.off("user-left", handleUserLeft);
      disconnect();
    };
  }, []);

  // Effect to scroll the chat container to the bottom whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle changes in the input field
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle the send button click to send a message
  const handleSendClick = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "message", user: userName, message: inputValue },
    ]);
    sendMessage(inputValue); // Send the message through the socket
    setInputValue(""); // Clear the input field after sending
  };

  // Handle form submission to set the username
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value.trim();
    if (enteredName) {
      setUserName(enteredName);
      userJoined(enteredName); // Notify the server that a user has joined
      setAskName(false); // Close the dialog
    }
  };

  return (
    <>
      {/* Dialog to ask for the user's name */}
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

      {/* Main chat UI */}
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

      {/* Input field for typing messages */}
      <div className={styles["enter-msg"]}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Enter message, ${userName}`}
        />
      </div>

      {/* Send button */}
      <div className={styles["btn"]}>
        <button onClick={handleSendClick}>Send</button>
      </div>

      {/* Audio element for playing notification sound */}
      <audio ref={audioRef} src={ting} />
    </>
  );
};

export default ChatPage;