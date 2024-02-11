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
  const [newRoomName, setNewRoomName] = useState("");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [userId] = useState<string>(uuid());

  const minutes = new Date(Date.now()).getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const getRoomMessages = async () => {
    try {
      const { data } = await api.get(`rooms?_embed=messages`);

      const allMessages = data.flatMap((room) => room.messages);

      setRooms(data);
      setContent(allMessages);
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    }
  };

  const handleMessageSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await api.post("messages", {
        id: uuid(),
        userName: user,
        content: currentMessage,
        timestamp: `${new Date(Date.now()).getHours()}:${formattedMinutes}`,
        roomId: selectedRoom,
      });

      const newMessage: Message = response.data;

      socket.emit("message", newMessage);

      setCurrentMessage("");
    } catch (error) {
      console.error("Erro ao enviar a mensagem", error);
    }
  };

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await api.post("rooms", {
        id: uuid(),
        name: newRoomName,
      });

      const newRoom: Room = response.data;

      socket.emit("create-room", newRoom);

      if (!rooms.find((room) => room.id === newRoom.id)) {
        socket.emit("create-room", newRoom);
        setRooms((prevRooms) => [...prevRooms, newRoom]);
      }

      setNewRoomName("");
    } catch (error) {
      console.error("Erro ao criar a sala", error);
    }
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
    socket.emit("enter-room", roomId);
  };

  useEffect(() => {
    const msgReceiveListener = (data) => {
      setContent((prev) => [...prev, data]);
    };

    socket.on("message", msgReceiveListener);

    return () => {
      socket.off("message", msgReceiveListener);
    };
  }, [socket]);

  useEffect(() => {
    const msgReceiveListener = (data) => {
      if (content.find((message) => message.id === data.id)) return;
      setContent((prev) => [...prev, data]);
    };

    socket.on("msg-receive", msgReceiveListener);

    return () => {
      socket.off("msg-receive", msgReceiveListener);
    };
  }, [socket]);

  useEffect(() => {
    const roomCreatedListener = (newRoom) => {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    };

    socket.on("create-room", roomCreatedListener);

    return () => {
      socket.off("create-room", roomCreatedListener);
    };
  }, [socket, rooms]);

  useEffect(() => {
    const roomCreatedListener = (newRoom) => {
      if (!rooms.find((room) => room.id === newRoom.id)) {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
      }
    };

    socket.on("view-room", roomCreatedListener);

    return () => {
      socket.off("view-room", roomCreatedListener);
    };
  }, [rooms]);

  useEffect(() => {
    getRoomMessages();
  }, []);

  console.log("content", content);

  return (
    <div className="flex flex-row gap-56">
      <div className="">Menu Lateral</div>
      <div className="flex flex-1 flex-col h-screen justify-between p-4 bg-slate-800">
        <div>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              value={newRoomName}
              placeholder="Nome da nova sala"
              onChange={(e) => setNewRoomName(e.target.value)}
              className="rounded py-2 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none"
            />
            <button
              type="submit"
              className="mb-5 p-2 rounded bg-primary text-white"
              disabled={!newRoomName}
            >
              Criar Sala
            </button>
          </form>
        </div>

        {rooms.map((room, index) => (
          <div key={index} className="mb-4">
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
          {content
            .filter((message) => message.roomId === selectedRoom)
            .map((message, index) => (
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
                      <p className="text-xs text-gray-500">
                        {message.timestamp}
                      </p>
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
        {selectedRoom && (
          <form
            className="flex items-center bg-dark py-2 px-4 rounded-2xl shadow-lg"
            onSubmit={handleMessageSubmit}
          >
            <input
              type="text"
              value={currentMessage}
              disabled={!selectedRoom}
              placeholder="Digite uma mensagem..."
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="rounded py-2 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none"
            />
            <button className="p-2 rounded" disabled={!selectedRoom}>
              <PaperPlaneTilt color="#615EF0" size={24} />
            </button>
          </form>
        )}
      </div>
      <div>Menu Lateral</div>
    </div>
  );
};
