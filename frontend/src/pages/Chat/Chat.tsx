import { useEffect, useState } from "react";

export const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    setMessages((prevMessages) => [...prevMessages]);
  }, []);

  const sendMessage = () => {
    setMessages((prevMessages) => [...prevMessages, currentMessage]);

    setCurrentMessage("");
  };

  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-2 text-white">
            {message}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="border p-2 flex-1 mr-2"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
