// frontend/src/Chat.jsx
import React, { useState, useEffect } from "react";
import socket from "./socket";
import "./Chat.css";

function Chat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-message", message);
      setChatLog(prev => [...prev, { sender: "You", text: message }]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setChatLog(prev => [...prev, { sender: "Stranger", text: message }]);
    });

    return () => socket.off("receive-message");
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Realtime Chat</div>

      <div className="chat-window">
        {chatLog.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender === "You" ? "you" : "stranger"}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;