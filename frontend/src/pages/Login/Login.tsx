import { FormData } from "@/@dtos";
import { Loading } from "@/components";
import { api } from "@/config";
import { useAuth } from "@/contexts";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "./ForgotPassword";
import { Register } from "./Register";

export const Login: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState<string>("Login");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onChange" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.get(
        `users?userName=${data.name}&password=${data.password}`
      );

      const userData = response.data[0];
      if (userData) {
        setUser({
          id: userData.id,
          userName: userData.userName,
          email: userData.email,
        });
        navigate("/");
      } else {
        setError("Usuário ou senha inválidos");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao buscar usuário", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark">
      {loading && <Loading />}

      <div className="bg-background p-8 rounded shadow-md w-96">
        {tabs === "Login" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-white">
              Logar no ChatApp!
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-400"
                >
                  Usuário
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Digite seu nome de usuário"
                  {...register("name", {
                    required: "Usuário obrigatório",
                  })}
                  className="rounded border-2 p-2 w-full mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-400"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua Senha"
                  {...register("password", { required: "Senha obrigatória" })}
                  className="rounded border-2 p-2 w-full mt-1"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primaryHover disabled:opacity-50 disabled:hover:bg-primary"
                >
                  Entrar
                </button>
                <button
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setTabs("Register")}
                >
                  Cadastro
                </button>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => setTabs("Forgot_Password")}
                  className="text-slate-400 hover:text-slate-200 opacity-40"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </form>
          </>
        )}

        {tabs === "Register" && <Register setTabs={setTabs} />}

        {tabs === "Forgot_Password" && <ForgotPassword setTabs={setTabs} />}
      </div>
    </div>
  );
};
