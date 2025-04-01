import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketURL = window.location.hostname === "localhost" 
      ? "http://localhost:3000" 
      : "https://efficio-kftq.onrender.com";

    const socketInstance = io(socketURL, {
      auth: { token },
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("newMessage", (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      socketInstance.off("newMessage");
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (input.trim() && socket) {
      socket.emit("newMessage", input);
      setInput("");
    }
  };

  return (
    <div>
      <h2>Chat Box</h2>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
