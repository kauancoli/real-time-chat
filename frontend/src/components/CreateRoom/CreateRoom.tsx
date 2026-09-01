import { Plus } from "@phosphor-icons/react";

type CreateRoomProps = {
  roomName: string;
  setRoomName: (value: string) => void;
  roomPass?: string;
  setRoomPass?: (value: string) => void;
  handleCreateRoom: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateRoom({
  roomName,
  roomPass,
  setRoomName,
  setRoomPass,
  handleCreateRoom,
}: CreateRoomProps) {
  return (
    <form className="create-room" onSubmit={handleCreateRoom}>
      <div className="section-heading">
        <span>Nova sala</span>
      </div>
      <input
        className="app-input"
        value={roomName}
        onChange={(event) => setRoomName(event.target.value)}
        placeholder="Nome da sala"
      />
      <input
        className="app-input"
        type="password"
        value={roomPass}
        onChange={(event) => setRoomPass?.(event.target.value)}
        placeholder="Senha (opcional)"
        maxLength={32}
      />
      <button
        className="button button--primary create-room-button"
        type="submit"
        disabled={!roomName.trim()}
      >
        <Plus size={18} /> Criar sala
      </button>
    </form>
  );
}
