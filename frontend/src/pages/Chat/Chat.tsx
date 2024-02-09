import { Message, Room } from "@/@dtos";
import { Props } from "@/@dtos/LoginProps/Props";

import { api } from "@/config";
import { PaperPlaneTilt } from "phosphor-react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export const Chat = ({ socket, user }: Props) => {
  const [content, setContent] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [userId] = useState<string>(uuid());

  const minutes = new Date(Date.now()).getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const getRoomMessages = async () => {
    try {
      const { data } = await api.get(`rooms?_embed=messages`);

      setRooms(data);
      setContent(data[0].messages);
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contentData: Message = {
      id: userId,
      userName: user,
      content: currentMessage,
      timestamp: `${new Date(Date.now()).getHours()}:${formattedMinutes}`,
      roomId: selectedRoom,
    };

    socket.emit("message", contentData);
    if (contentData.content.trim() === "") return;
    setContent((prevMessages) => [...prevMessages, contentData]);

    setCurrentMessage("");
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
    socket.emit("room", roomId);
  };

  useEffect(() => {
    getRoomMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("msg-receive", (data) => {
        setReceiver(data);
      });
    }
  }, []);

  useEffect(() => {
    receiver && setContent((prev) => [...prev, receiver]);
  }, [receiver]);

  return (
    <div className="flex flex-row gap-56">
      <div className="">Menu Lateral</div>
      <div className="flex flex-1 flex-col h-screen justify-between p-4 bg-slate-800">
        {rooms.map((room) => (
          <div key={room.id} className="mb-4">
            <button
              className={`text-white text-xl font-bold p-2 rounded ${
                selectedRoom === room.id ? "bg-black" : "bg-gray-900"
              }`}
              onClick={() => handleRoomClick(room.id)}
            >
              {room.name}
            </button>
          </div>
        ))}

        <div className="flex-1 overflow-y-auto">
          {content.map((message, index) => (
            <div
              key={index}
              className={`mb-6 text-white flex ${
                message.userName === user ? "justify-start" : "justify-end"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`flex items-center justify-center rounded-full w-10 h-10 mr-3 font-bold select-none ${
                    message.userName === user ? "bg-primary" : "bg-gray-700"
                  }`}
                >
                  {message.userName.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center mb-1 gap-2">
                    <p className="text-base font-bold">{message.userName}</p>
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                  </div>
                  <div
                    className={`p-2 rounded ${
                      message.userName === user ? "bg-primary" : "bg-gray-700"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
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
