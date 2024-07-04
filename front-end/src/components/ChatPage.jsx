import React, { useEffect, useState } from "react";
import styles from "./ChatPage.module.css";
import { io } from "socket.io-client";
import { socket, userJoined } from "../api/client";

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

  useEffect(() => {
    socket.on("user-joined", (name) => {
      console.log("new member joined", name);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user-joined", user: name, message: `${name} has joined!!` },
      ]);
    });
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    console.log(`${userName}: ${inputValue}`);
    setInputValue(""); // Clear the input field after sending
  };

  const handleClose = (enteredName = null) => {
    if(enteredName || userName){
      setAskName(false);
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const enteredName = formData.get("name");
    setUserName(enteredName);
    userJoined(enteredName);
    handleClose(enteredName);
  };

  return (
    <>
      <Dialog
        open={askName}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleFormSubmit,
        }}
        fullWidth = '50%'
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

        {/* <div className={styles['my-msg']}>
          Hello!!
        </div>

        <div className={styles['other-msg']}>
          How are you?!
        </div>

        <div className={styles['joined-msg']}>
          
        </div> */}
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
