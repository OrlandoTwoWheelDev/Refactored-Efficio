import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:10000');

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('receive_message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const handleMessageSubmit = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <h2>Coming soon - Chat Rooms!</h2>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className="message">{message}</div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleMessageSubmit}>Send</button>
      </div>
    </div>
  );
}
