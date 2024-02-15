import { Message, Room, User } from "@/@dtos";
import { CreateRoom, Loading } from "@/components";
import { api } from "@/config";
import { useAuth, useSocket } from "@/contexts";
import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Chat } from "../Chat";

export const Home = () => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [content, setContent] = useState<Message[]>([]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deslogar", error);
    }
  };

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("rooms", {
        id: uuid(),
        name: newRoomName,
      });

      const room: Room = response.data;

      socket.emit("create-room", room);

      setLoading(false);
      setNewRoomName("");
    } catch (error) {
      setLoading(false);
      console.error("Erro ao criar a sala", error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      await api.delete(`rooms/${roomId}`);

      socket.emit("delete-room", roomId);

      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao deletar a sala", error);
    }
  };

  const searchRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    if (search) {
      const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase())
      );

      setRooms(filteredRooms);
    } else {
      getRoomMessages();
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
    const roomDeletedListener = (roomId: string) => {
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    };

    socket.on("delete-room", roomDeletedListener);

    return () => {
      socket.off("delete-room", roomDeletedListener);
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
  }, [rooms, socket]);

  useEffect(() => {
    getRoomMessages();
  }, []);

  useEffect(() => {
    socket.on("view-room", (room: Room) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((r) =>
          r.id === room.id ? { ...r, name: room.name } : r
        );

        return updatedRooms;
      });
    });

    return () => {
      socket.off("view-room");
    };
  }, [socket]);

  return (
    <div className="flex flex-row gap-8 p-8 h-screen w-screen">
      {loading && <Loading />}
      {/* Left Side */}
      <div className="flex flex-col gap-8 p-4 bg-dark rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 font-bold select-none bg-primary text-white`}
            >
              {user.userName.slice(0, 1).toUpperCase()}
            </div>

            <div className="flex flex-col items-start">
              <div className="text-white font-bold text-lg">
                <div className="tooltip" data-tip={`${user.userName}`}>
                  <span>
                    {user.userName.length > 18
                      ? `${user.userName.slice(0, 18)}...`
                      : user.userName}
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
                <a
                  className="p-2"
                  onClick={() =>
                    (
                      document.getElementById(
                        "profile-modal"
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                >
                  Perfil
                </a>
              </li>

              <dialog id="profile-modal" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Olá {user.userName}!</h3>
                  <p className="py-4">
                    Pressione ESC para fechar a janela de perfil.
                  </p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Fechar</button>
                    </form>
                  </div>
                </div>
              </dialog>

              <li>
                <a className="p-2" onClick={handleLogout}>
                  Deslogar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex border rounded-full border-primary items-center px-4">
          <MagnifyingGlass color="#615EF0" size={20} />
          <input
            type="text"
            placeholder="Buscar salas..."
            onChange={searchRoom}
            className="rounded-full py-2 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none text-base"
          />
        </div>

        <div className="divider">Salas</div>

        <div className="flex flex-col gap-4 justify-start h-[30rem] overflow-y-scroll px-3">
          {rooms.map((room) => (
            <div key={room.id}>
              <div
                className={`flex justify-between btn ${
                  selectedRoom === room.id ? "bg-primary" : "bg-background"
                }`}
                onClick={() => handleRoomClick(room.id)}
              >
                <button className={`flex justify-start items-center border-0`}>
                  <div className="avatar offline mr-2">
                    <div className="w-8 rounded-full">
                      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                  </div>
                  {room.name}
                </button>

                <div
                  className="p-2"
                  onClick={() =>
                    (
                      document.getElementById(
                        `modal-${room.id}`
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
              </div>
              <dialog id={`modal-${room.id}`} className="modal cursor-default">
                <div className="modal-box">
                  <h3 className="font-bold text-lg mb-8 text-center">
                    Tem certeza que deseja deletar a sala:{" "}
                    <span className="text-primary">{room.name}?</span>
                  </h3>

                  <form method="dialog" className="flex justify-center gap-4">
                    <button className="btn">Cancelar</button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      Deletar
                    </button>
                  </form>
                </div>
              </dialog>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        <div className="mt-28">
          <CreateRoom
            setRoomName={setNewRoomName}
            handleCreateRoom={handleCreateRoom}
            roomName={newRoomName}
          />
        </div>
      </div>

      {/* Left Side */}

      {/* Mid */}
      <Chat selectedRoom={selectedRoom} msgs={content} />
      {/* Mid Side */}

      {/* Right Side */}
      <div>Menu Lateral</div>
      {/* Right Side */}
    </div>
  );
};
