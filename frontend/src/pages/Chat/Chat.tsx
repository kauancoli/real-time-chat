import { useSocket } from "@/app/providers/useSocket";
import { Avatar, Button, Loading } from "@/components";
import { MessageInput } from "@/components/MessageInput";
import { useAuth } from "@/features/auth/useAuth";
import { MessageList } from "@/features/messages/MessageList";
import { createMessage } from "@/services/api/messages";
import { getRooms, updateRoom } from "@/services/api/rooms";
import { Message, Room } from "@/types/domain";
import { PencilSimple } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

type ChatProps = { selectedRoom: string; msgs: Message[] };

export const Chat = ({ selectedRoom, msgs }: ChatProps) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomChange, setRoomChange] = useState("");
  const messages = useMemo(
    () => [...msgs, ...receivedMessages],
    [msgs, receivedMessages],
  );
  const activeRoom = rooms.find((room) => room.id === selectedRoom);

  const loadRooms = async () => {
    setLoading(true);
    try {
      setRooms(await getRooms());
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    } finally {
      setLoading(false);
    }
  };

  const changeRoomName = async () => {
    if (!roomChange.trim() || !activeRoom) return;
    try {
      const data = await updateRoom(activeRoom.id, {
        ...activeRoom,
        name: roomChange.trim(),
      });
      setRooms((current) =>
        current.map((room) => (room.id === data.id ? data : room)),
      );
      socket.emit("update-room", data);
      setRoomChange("");
      (document.getElementById("rename-room") as HTMLDialogElement).close();
    } catch (error) {
      console.error("Erro ao alterar a sala", error);
    }
  };

  const handleMessageSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!currentMessage.trim() || !selectedRoom) return;
    const now = new Date();
    setLoading(true);
    try {
      const data = await createMessage({
        id: uuid(),
        userName: user.userName,
        content: currentMessage.trim(),
        timestamp: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        roomId: selectedRoom,
      });
      socket.emit("message", data);
      setCurrentMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onMessage = (message: Message) =>
      setReceivedMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message],
      );
    const onRoom = (room: Room) =>
      setRooms((current) =>
        current.map((item) =>
          item.id === room.id ? { ...item, ...room } : item,
        ),
      );
    socket.on("msg-received", onMessage);
    socket.on("view-room", onRoom);
    return () => {
      socket.off("msg-received", onMessage);
      socket.off("view-room", onRoom);
    };
  }, [socket]);

  useEffect(() => {
    void loadRooms();
  }, []);

  if (!selectedRoom)
    return (
      <section className="chat-panel chat-empty">
        <div className="empty-orb">✦</div>
        <p className="eyebrow">Chat em tempo real</p>
        <h1>Escolha uma sala para começar</h1>
        <span>Suas conversas aparecerão aqui, sem distrações.</span>
      </section>
    );

  return (
    <section className="chat-panel">
      {loading && <Loading />}
      <header className="chat-header">
        <div className="room-title">
          <Avatar name={activeRoom?.name ?? "?"} className="avatar--room" />
          <div>
            <span className="eyebrow">Sala ativa</span>
            <h1>{activeRoom?.name ?? "Carregando..."}</h1>
          </div>
        </div>
        <Button
          variant="ghost"
          className="button--compact"
          onClick={() =>
            (
              document.getElementById("rename-room") as HTMLDialogElement
            ).showModal()
          }
        >
          <PencilSimple size={17} /> Renomear
        </Button>
      </header>
      <MessageList
        currentUserName={user.userName}
        messages={messages.filter((message) => message.roomId === selectedRoom)}
        roomId={selectedRoom}
        roomName={activeRoom?.name ?? "sala"}
      />
      <MessageInput
        msg={currentMessage}
        setMsg={setCurrentMessage}
        handleMessageSubmit={handleMessageSubmit}
        roomId={selectedRoom}
      />
      <dialog id="rename-room" className="app-dialog">
        <div className="dialog-card">
          <h3>Renomear sala</h3>
          <p>Dê um nome claro para a conversa.</p>
          <input
            className="app-input"
            aria-label="Novo nome da sala"
            value={roomChange}
            onChange={(event) => setRoomChange(event.target.value)}
            placeholder={activeRoom?.name}
          />
          <div className="dialog-actions">
            <Button onClick={changeRoomName}>Salvar</Button>
            <form method="dialog">
              <Button variant="ghost">Cancelar</Button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
};
