import { Message, Room } from "@/@dtos";
import { CreateRoom, Loading } from "@/components";
import { api } from "@/config";
import { useAuth, useSocket } from "@/contexts";
import { Lock, MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Chat } from "../Chat";

export const Home = () => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPass, setNewRoomPass] = useState("");
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
        userId: user.id,
        password: newRoomPass,
      });

      const room: Room = response.data;

      socket.emit("create-room", room);

      setLoading(false);
      setNewRoomName("");
      setNewRoomPass("");
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
    const room = rooms.find((r) => r.id === roomId);

    if (room.userId === user.id || user.id === "1") {
      setSelectedRoom(roomId);
      socket.emit("enter-room", roomId);
      return;
    }

    if (room) {
      if (room.password) {
        const enteredPassword = prompt("Digite a senha da sala:");
        if (enteredPassword !== room.password) {
          alert("Senha incorreta. Tente novamente.");
          return;
        }
      }

      setSelectedRoom(roomId);
      socket.emit("enter-room", roomId);
    }
  };

  useEffect(() => {
    const roomCreated = (room: Room) => {
      setRooms((prevRooms) => [...prevRooms, room]);
    };

    const roomDeletedListener = (roomId: string) => {
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    };

    const roomCreatedListener = (room: Room) => {
      if (!rooms.find((r) => r.id === room.id)) {
        setRooms((prevRooms) => [...prevRooms, room]);
      }
    };

    socket.on("create-room", roomCreated);
    socket.on("delete-room", roomDeletedListener);
    socket.on("view-room", roomCreatedListener);

    return () => {
      socket.off("create-room", roomCreated);
      socket.off("delete-room", roomDeletedListener);
      socket.off("view-room", roomCreatedListener);
    };
  }, [socket, rooms]);

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

  useEffect(() => {
    getRoomMessages();
  }, []);

  return (
    <div className="flex flex-row gap-8 2xl:p-16 xl:p-14 lg:p-12 p-32 h-screen w-screen ">
      {loading && <Loading />}
      {/* Left Side */}
      <div className="flex flex-col gap-8 p-4 bg-dark rounded-lg lg:gap-0">
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
                className={`rounded-lg px-4 py-1 text-sm text-white ${
                  selectedRoom === room.id ? "bg-primary" : "bg-background"
                }`}
              >
                <div className="flex items-center">
                  <button
                    className={`flex items-center border-0 w-full gap-1`}
                    onClick={() => handleRoomClick(room.id)}
                  >
                    {room.userId === user.id && (
                      <span className="text-xs mr-2">👑</span>
                    )}
                    {room.password && (
                      <span className="text-xs mr-2">
                        <Lock size={14} />
                      </span>
                    )}
                    <div className="mr-2">
                      <div
                        className={`w-8 h-8 font-bold rounded-full text-lg flex justify-center items-center bg-white text-dark`}
                      >
                        {room.name ? room.name.slice(0, 1).toUpperCase() : ""}
                      </div>
                    </div>
                    {room.name}
                  </button>

                  {(room.userId === user.id ||
                    user.id === "1" ||
                    user.userName === "admin") && (
                    <div
                      className="p-2 cursor-pointer"
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
                  )}
                </div>
              </div>
              <dialog id={`modal-${room.id}`} className="modal cursor-default">
                <div className="modal-box">
                  <h3 className="font-bold text-lg mb-8 text-center">
                    Tem certeza que deseja deletar a sala:{" "}
                    <span className="text-primary">{room.name}?</span>
                  </h3>

                  <form method="dialog" className="flex justify-center gap-4">
                    <button
                      className="btn btn-error"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      Deletar
                    </button>
                    <button className="btn">Cancelar</button>
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
            roomPass={newRoomPass}
            setRoomPass={setNewRoomPass}
          />
        </div>
      </div>

      {/* Left Side */}

      <Chat selectedRoom={selectedRoom} msgs={content} />
    </div>
  );
};
