type CreateRoom = {
  roomName: string;
  setRoomName: (value: string) => void;
  handleCreateRoom: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateRoom({
  setRoomName,
  handleCreateRoom,
  roomName,
}: CreateRoom) {
  return (
    <form onSubmit={handleCreateRoom}>
      <input
        type="text"
        value={roomName}
        placeholder="Nome da nova sala"
        onChange={(e) => setRoomName(e.target.value)}
        className="rounded py-3 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none border border-background text-sm"
      />
      <button
        type="submit"
        className="btn bg-primary hover:bg-primaryHover"
        disabled={!roomName}
      >
        Criar Sala
      </button>
    </form>
  );
}
