import { useSocket } from "@/app/providers/useSocket";
import { Avatar, CreateRoom, IconButton, Loading } from "@/components";
import { useAuth } from "@/features/auth/useAuth";
import {
  createRoom,
  deleteRoom,
  getRoomsWithMessages,
} from "@/services/api/rooms";
import { Message, Room } from "@/types/domain";
import {
  ChatCircleDots,
  Lock,
  MagnifyingGlass,
  SignOut,
  Trash,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Chat } from "../Chat";

export const Home = () => {
  const { socket } = useSocket();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPass, setNewRoomPass] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [content, setContent] = useState<Message[]>([]);
  const [search, setSearch] = useState("");

  const visibleRooms = useMemo(
    () =>
      rooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [rooms, search],
  );

  const getRoomMessages = async () => {
    setLoading(true);
    try {
      const roomsWithMessages = await getRoomsWithMessages();
      setRooms(roomsWithMessages);
      setContent(roomsWithMessages.flatMap((room) => room.messages ?? []));
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.location.reload();
  };

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newRoomName.trim()) return;
    setLoading(true);
    try {
      const room = await createRoom({
        id: uuid(),
        name: newRoomName.trim(),
        userId: user.id,
        password: newRoomPass,
      });
      socket.emit("create-room", room);
      setNewRoomName("");
      setNewRoomPass("");
    } catch (error) {
      console.error("Erro ao criar a sala", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      await deleteRoom(roomId);
      socket.emit("delete-room", roomId);
      setRooms((current) => current.filter((room) => room.id !== roomId));
      if (selectedRoom === roomId) setSelectedRoom("");
    } catch (error) {
      console.error("Erro ao deletar a sala", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    const isOwner = room.userId === user.id || user.id === "1";
    if (
      !isOwner &&
      room.password &&
      prompt("Digite a senha da sala:") !== room.password
    ) {
      alert("Senha incorreta. Tente novamente.");
      return;
    }
    setSelectedRoom(room.id);
    socket.emit("enter-room", room.id);
  };

  useEffect(() => {
    const addRoom = (room: Room) =>
      setRooms((current) =>
        current.some((item) => item.id === room.id)
          ? current
          : [...current, room],
      );
    const removeRoom = (roomId: string) =>
      setRooms((current) => current.filter((room) => room.id !== roomId));
    const updateRoom = (updated: Room) =>
      setRooms((current) =>
        current.map((room) =>
          room.id === updated.id ? { ...room, ...updated } : room,
        ),
      );
    socket.on("create-room", addRoom);
    socket.on("delete-room", removeRoom);
    socket.on("view-room", updateRoom);
    return () => {
      socket.off("create-room", addRoom);
      socket.off("delete-room", removeRoom);
      socket.off("view-room", updateRoom);
    };
  }, [socket]);

  useEffect(() => {
    void getRoomMessages();
  }, []);

  return (
    <main className="app-shell">
      {loading && <Loading />}
      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="profile-summary">
            <Avatar name={user.userName} className="avatar--primary" />
            <div className="profile-copy">
              <span>Seu espaço</span>
              <strong title={user.userName}>{user.userName}</strong>
            </div>
          </div>
          <IconButton aria-label="Sair" onClick={handleLogout}>
            <SignOut size={20} />
          </IconButton>
        </header>

        <label className="room-search" aria-label="Buscar salas">
          <MagnifyingGlass size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar salas..."
          />
        </label>
        <div className="section-heading">
          <span>Salas</span>
          <small>{visibleRooms.length}</small>
        </div>

        <div className="room-list">
          {visibleRooms.map((room) => {
            const canDelete =
              room.userId === user.id ||
              user.id === "1" ||
              user.userName === "admin";
            return (
              <article
                key={room.id}
                className={`room-item ${selectedRoom === room.id ? "room-item--active" : ""}`}
              >
                <button
                  className="room-select"
                  onClick={() => handleRoomClick(room)}
                >
                  <Avatar name={room.name} className="room-avatar" />
                  <span className="room-name">{room.name}</span>
                  {room.userId === user.id && (
                    <span className="room-owner">★</span>
                  )}
                  {room.password && <Lock className="room-lock" size={15} />}
                </button>
                {canDelete && (
                  <IconButton
                    className="room-delete"
                    aria-label={`Excluir ${room.name}`}
                    onClick={() =>
                      (
                        document.getElementById(
                          `modal-${room.id}`,
                        ) as HTMLDialogElement
                      ).showModal()
                    }
                  >
                    <Trash size={17} />
                  </IconButton>
                )}
                <dialog id={`modal-${room.id}`} className="app-dialog">
                  <div className="dialog-card">
                    <h3>Excluir “{room.name}”?</h3>
                    <p>Essa ação não pode ser desfeita.</p>
                    <form method="dialog" className="dialog-actions">
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Excluir sala
                      </button>
                      <button className="button button--ghost">Cancelar</button>
                    </form>
                  </div>
                </dialog>
              </article>
            );
          })}
          {!visibleRooms.length && (
            <div className="empty-rooms">
              <ChatCircleDots size={28} />
              <p>Nenhuma sala encontrada.</p>
            </div>
          )}
        </div>
        <div className="create-room-panel">
          <CreateRoom
            roomName={newRoomName}
            roomPass={newRoomPass}
            setRoomName={setNewRoomName}
            setRoomPass={setNewRoomPass}
            handleCreateRoom={handleCreateRoom}
          />
        </div>
      </aside>
      <Chat selectedRoom={selectedRoom} msgs={content} />
    </main>
  );
};
