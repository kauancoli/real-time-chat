import { Props } from "@/@dtos/LoginProps/Props";
import { MessageData } from "@/@dtos/Message/Message";
import { PaperPlaneTilt } from "phosphor-react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export const Chat = ({ socket, user, room }: Props) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [userId] = useState<string>(uuid());
  const minutes = new Date(Date.now()).getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageData: MessageData = {
      id: userId,
      message: currentMessage,
      room: room,
      user: user,
      time: `${new Date(Date.now()).getHours()}:${formattedMinutes}`,
    };

    socket.emit("message", messageData);

    if (messageData.message.trim() === "") return;
    setMessages((prevMessages) => [...prevMessages, messageData]);

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
    <div className="flex flex-row gap-56">
      <div className="">Menu Lateral</div>
      <div className="flex flex-1 flex-col h-screen justify-between p-4 bg-slate-800">
        <div className="flex-1 overflow-y-auto">
          {messages.map((messageData, index) => (
            <div
              key={index}
              className={`mb-6 text-white flex ${
                messageData.user === user ? "justify-start" : "justify-end"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`flex items-center justify-center rounded-full w-10 h-10 mr-3 font-bold select-none ${
                    messageData.user === user ? "bg-primary" : "bg-gray-700"
                  }`}
                >
                  {messageData.user.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center mb-1 gap-2">
                    <p className="text-base font-bold">{messageData.user}</p>
                    <p className="text-xs text-gray-500">{messageData.time}</p>
                  </div>
                  <div
                    className={`p-2 rounded ${
                      messageData.user === user ? "bg-primary" : "bg-gray-700"
                    }`}
                  >
                    <p className="text-sm">{messageData.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex items-center bg-dark py-2 px-4 rounded-2xl shadow-lg"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            value={currentMessage}
            placeholder="Digite uma mensagem..."
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="rounded py-2 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none"
          />
          <button className="p-2 rounded">
            <PaperPlaneTilt color="#615EF0" size={24} />
          </button>
        </form>
      </div>
      <div>Menu Lateral</div>
    </div>
  );
};
