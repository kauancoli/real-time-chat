import { Message, Room } from "@/@dtos";
import { Loading } from "@/components/Loading";
import { MessageInput } from "@/components/MessageInput";

import { api } from "@/config";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";

type ChatProps = {
  socket: Socket;
  selectedRoom: string;
  msgs: Message[];
};

export const Chat = ({ socket, selectedRoom, msgs }: ChatProps) => {
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const [room, setRoom] = useState<Room[]>([]);

  const minutes = new Date(Date.now()).getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const user = localStorage.getItem("username");

  const getRooms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("rooms");

      setRoom(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Erro ao buscar salas", error);
      setLoading(false);
    }
  };

  const handleMessageSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await api.post("messages", {
        id: uuid(),
        userName: user,
        content: currentMessage,
        timestamp: `${new Date(Date.now()).getHours()}:${formattedMinutes}`,
        roomId: selectedRoom,
      });

      const msg: Message = response.data;
      socket.emit("message", msg);
      setCurrentMessage("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao enviar a mensagem", error);
    }
  };

  useEffect(() => {
    socket.on("msg-received", (msg) => {
      setContent((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("msg-received");
    };
  }, [socket]);

  useEffect(() => {
    setContent(msgs);
  }, [msgs]);

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-between p-4 bg-slate-800 rounded-lg">
      {loading && <Loading />}

      {selectedRoom ? (
        <div className="navbar bg-background rounded-lg">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
          <div className="p-4 font-bold text-lg text-white">
            {room.filter((r) => r.id === selectedRoom).map((r) => r.name)}
          </div>

          {/* <div className="p-4 font-bold text-sm text-white">
          Membros online:
          {room
            .filter((r) => r.id === selectedRoom)
            .map((r) => r.users?.length)}
          </div> */}
          <div className="flex justify-between">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  ></path>
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-32"
              >
                <li>
                  <a>Homepage</a>
                </li>
                <li>
                  <a>Portfolio</a>
                </li>
                <li>
                  <a>About</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold text-white">Selecione uma sala</h1>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-16 mt-5">
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
      {selectedRoom && (
        <MessageInput
          msg={currentMessage}
          setMsg={setCurrentMessage}
          handleMessageSubmit={handleMessageSubmit}
          roomId={selectedRoom}
        />
      )}
    </div>
  );
};
