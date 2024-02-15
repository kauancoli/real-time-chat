type CreateRoom = {
  roomName: string;
  setRoomName: (value: string) => void;
  roomPass?: string;
  setRoomPass?: (value: string) => void;
  handleCreateRoom: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateRoom({
  setRoomName,
  setRoomPass,
  handleCreateRoom,
  roomName,
  roomPass,
}: CreateRoom) {
  return (
    <form onSubmit={handleCreateRoom}>
      <div>
        <input
          type="text"
          value={roomName}
          placeholder="Nome da nova sala"
          onChange={(e) => setRoomName(e.target.value)}
          className="rounded py-3 px-2 bg-transparent text-white focus:outline-none border border-background text-sm"
        />

        <input
          type="text"
          value={roomPass}
          onChange={(e) => setRoomPass(e.target.value)}
          placeholder="Senha (opcional)"
          className="rounded py-3 px-4 mr-2 bg-transparent text-white focus:outline-none border border-background text-sm"
          maxLength={5}
        />
      </div>

      <button
        type="submit"
        className="btn bg-primary hover:bg-primaryHover mt-2"
        disabled={!roomName}
      >
        Criar Sala
      </button>
    </form>
  );
}
