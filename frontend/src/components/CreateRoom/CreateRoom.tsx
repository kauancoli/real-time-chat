import { Plus } from "@phosphor-icons/react";
import { Button, Input } from "@/components/ui";

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
      <Input
        label="Nome da sala"
        value={roomName}
        onChange={(event) => setRoomName(event.target.value)}
        placeholder="Nome da sala"
      />
      <Input
        label="Senha da sala"
        type="password"
        value={roomPass}
        onChange={(event) => setRoomPass?.(event.target.value)}
        placeholder="Senha (opcional)"
        maxLength={32}
      />
      <Button
        className="create-room-button"
        type="submit"
        disabled={!roomName.trim()}
      >
        <Plus size={18} /> Criar sala
      </Button>
    </form>
  );
}
