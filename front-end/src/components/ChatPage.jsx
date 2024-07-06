import React, { useEffect, useState, useRef } from "react";
import styles from "./ChatPage.module.css";
import { sendMessage, socket, userJoined } from "../api/client";

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
  const [messages, setMessages] = useState([
    { type: "message", user: "bot", message: "Hello from abc!!" },
  ]);
  const [askName, setAskName] = useState(true);
  const nameInputRef = useRef(null);

  useEffect(() => {
    socket.on("user-joined", (name) => {
      console.log("new member joined", name);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user-joined", user: name, message: `${name} has joined!!` },
      ]);
    });

    socket.on("receive", (data) => {
      console.log(data, "recieve");
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "message", user: data.name, message: data.message },
      ]);
    });
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    // console.log(`${userName}: ${inputValue}`);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "message", user: userName, message: inputValue },
    ]);
    sendMessage(inputValue);
    setInputValue(""); // Clear the input field after sending
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

      <div className={styles["chat-container"]}>
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
            {data.user} = {data.message}
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
    </>
  );
};

export default ChatPage;