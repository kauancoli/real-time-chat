import { useState } from "react";
import { Home } from "../Home";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false);

  const handleLogin = () => {
    if (username.trim() !== "") {
      setLogged(true);
      localStorage.setItem("username", username);
    }
  };

  return (
    <>
      {!logged ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Bem-vindo ao ChatApp!
          </h1>
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded border-2 p-2 text-base"
              />
            </div>
            <button
              onClick={handleLogin}
              className="bg-primary hover:bg-primaryHover text-white font-bold py-2 px-4 rounded"
            >
              Entrar
            </button>
          </div>
        </div>
      ) : (
        <Home />
      )}
    </>
  );
};
