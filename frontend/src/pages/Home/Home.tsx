import { Props } from "@/@dtos/LoginProps/Props";
import { MessageData } from "@/@dtos/Message/Message";
import { PaperPlaneTilt } from "phosphor-react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Chat } from "../Chat";

export const Home = () => {
  return (
    <div className="flex flex-row gap-56">
      <div className="">Menu Lateral</div>
      <Chat />
      <div>Menu Lateral</div>
    </div>
  );
};
