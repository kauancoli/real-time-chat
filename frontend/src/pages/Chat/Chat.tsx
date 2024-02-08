import { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

type MessageData = {
  id: string;
  message: string;
};

const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("Connected to server");
});

export const Chat = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [userId] = useState<string>(uuid());

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageData: MessageData = { id: userId, message: currentMessage };

    socket.emit("message", messageData);

    setCurrentMessage("");
  };

  useEffect(() => {
    const handleIncomingMessage = (messageData: MessageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((messageData, index) => (
          <div
            key={index}
            className={`mb-2 text-white ${
              messageData.id === userId ? "text-right" : "text-left"
            }`}
          >
            {`${
              messageData.id === userId ? "You" : "User " + messageData.id
            }: ${messageData.message}`}
          </div>
        ))}
      </div>
      <form className="flex items-center mt-4" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="border p-2 flex-1 mr-2"
        />
        <button className="bg-blue-500 text-white p-2 rounded">Enviar</button>
      </form>
    </div>
  );
};
