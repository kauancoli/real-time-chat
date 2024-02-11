import { Message, Room } from "@/@dtos";
import { CreateRoom } from "@/components";
import { api } from "@/config";
import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { Chat } from "../Chat";

const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("Connected to server");
});

export const Home = () => {
  const [loading, setLoading] = useState(false);

  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [content, setContent] = useState<Message[]>([]);

  const user = localStorage.getItem("username");

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await api.post("rooms", {
        id: uuid(),
        name: newRoomName,
      });

      const room: Room = response.data;

      socket.emit("create-room", room);

      if (!rooms.find((room) => room.id === room.id)) {
        socket.emit("create-room", room);
        setRooms((prevRooms) => [...prevRooms, room]);
      }

      setNewRoomName("");
    } catch (error) {
      console.error("Erro ao criar a sala", error);
    }
  };

  const getRoomMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`rooms?_embed=messages`);

      const allMessages = data.flatMap((room: Room) => room.messages);

      setRooms(data);
      setContent(allMessages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao buscar salas", error);
    }
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
    socket.emit("enter-room", roomId);
  };

  useEffect(() => {
    const roomCreatedListener = (room) => {
      setRooms((prevRooms) => [...prevRooms, room]);
    };

    socket.on("create-room", roomCreatedListener);

    return () => {
      socket.off("create-room", roomCreatedListener);
    };
  }, [socket, rooms]);

  useEffect(() => {
    const roomCreatedListener = (room: Room) => {
      if (!rooms.find((r) => r.id === room.id)) {
        setRooms((prevRooms) => [...prevRooms, room]);
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

  return (
    <div className="flex flex-row gap-8 p-8 h-screen w-screen">
      {/* Left Side */}
      <div className="flex flex-col gap-8 p-4 bg-dark rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 font-bold select-none bg-primary text-white`}
            >
              {user.slice(0, 1).toUpperCase()}
            </div>

            <div className="flex flex-col items-start">
              <div className="text-white font-bold text-lg">
                <div className="tooltip" data-tip={`${user}`}>
                  <span>
                    {user.length > 18 ? `${user.slice(0, 18)}...` : user}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-1 z-[1] p-2 shadow bg-base-100 rounded-box w-36"
            >
              <li>
                <a className="p-2">Perfil</a>
              </li>
              <li>
                <a className="p-2">Deslogar</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex border rounded-full border-primary items-center px-4">
          <MagnifyingGlass color="#615EF0" size={20} />
          <input
            type="text"
            placeholder="Buscar salas..."
            onChange={(e) => {
              e.target.value;
            }}
            className="rounded-full py-2 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none text-base"
          />
        </div>

        <div className="divider">Salas</div>

        <div className="flex flex-col gap-4 justify-start">
          {rooms.map((room, index) => (
            <div key={index}>
              <button
                className={`btn w-full justify-start ${
                  selectedRoom === room.id ? "bg-primary" : "bg-background"
                }`}
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="avatar offline mr-2">
                  <div className="w-8 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                {room.name}
              </button>
            </div>
          ))}
        </div>

        <CreateRoom
          setRoomName={setNewRoomName}
          handleCreateRoom={handleCreateRoom}
          roomName={newRoomName}
        />
      </div>
      {/* Left Side */}

      {/* Mid */}
      <Chat socket={socket} selectedRoom={selectedRoom} msgs={content} />
      {/* Mid Side */}

      {/* Right Side */}
      <div>Menu Lateral</div>
      {/* Right Side */}
    </div>
  );
};
