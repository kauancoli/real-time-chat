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
  const [roomChange, setRoomChange] = useState<string>("");

  const minutes = new Date(Date.now()).getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const user = sessionStorage.getItem("userName");
  const roomName = room.filter((r) => r.id === selectedRoom).map((r) => r.name);

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

  const changeRoomName = async (roomId: string) => {
    try {
      if (roomChange !== "") {
        const updatedRoom = await api.put(`rooms/${roomId}`, {
          id: roomId,
          name: roomChange,
        });

        setRoom((prevRooms) =>
          prevRooms.map((r) =>
            r.id === roomId ? { ...r, name: updatedRoom.data.name } : r
          )
        );

        socket.emit("update-room", updatedRoom.data);
      }
    } catch (error) {
      console.error("Erro ao buscar salas", error);
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

    socket.on("view-room", (room) => {
      setRoom((prevRooms) => {
        if (!prevRooms.some((r) => r.id === room.id)) {
          return [...prevRooms, room];
        }
        return prevRooms;
      });
    });

    return () => {
      socket.off("view-room");
    };
  }, [socket]);

  return (
    <div className="flex flex-1 flex-col justify-between p-4 bg-slate-800 rounded-lg">
      {loading && <Loading />}

      {selectedRoom ? (
        <div className="navbar bg-background rounded-lg px-8 justify-between cursor-pointer">
          <div>
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <div className="p-4 font-bold text-lg text-white">{roomName}</div>
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
                  <a
                    className="p-2"
                    onClick={() =>
                      (
                        document.getElementById(
                          `room-modal-${selectedRoom}`
                        ) as HTMLDialogElement
                      ).showModal()
                    }
                  >
                    Alterar Nome
                  </a>
                </li>

                <dialog id={`room-modal-${selectedRoom}`} className="modal">
                  <div className="modal-box">
                    <div className="flex flex-col gap-8">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-2xl">{roomName}</h3>
                        <button
                          className="btn"
                          onClick={() => changeRoomName(selectedRoom)}
                        >
                          Alterar Nome
                        </button>
                      </div>

                      <input
                        type="text"
                        onChange={(e) => setRoomChange(e.target.value)}
                        className="rounded py-2 px-4 flex-1 mr-2 bg-background text-white focus:outline-none text-sm"
                        placeholder="Digite um novo nome..."
                      />
                    </div>

                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn">Fechar</button>
                      </form>
                    </div>
                  </div>
                </dialog>

                <li>
                  <a>Sair do Chat</a>
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

      <div className="flex-1 overflow-y-auto px-16 py-4 mt-5">
        {content
          .filter((message) => message.roomId === selectedRoom)
          .map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.userName === user ? "chat-start" : "chat-end"
              }`}
            >
              <div className={`chat-image`}>
                <div
                  className={`w-10 h-10 font-bold rounded-full text-lg flex justify-center items-center ${
                    message.userName === user ? "bg-primary" : "bg-gray-700"
                  }`}
                >
                  {message.userName.slice(0, 1).toUpperCase()}
                </div>
              </div>

              <div className="chat-header flex gap-2 items-center">
                {message.userName}
                <time className="text-xs opacity-50">{message.timestamp}</time>
              </div>

              <div
                className={`chat-bubble ${
                  message.userName === user ? "bg-primary" : "bg-gray-700"
                }`}
              >
                {message.content}
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
