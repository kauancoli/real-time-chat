import { Layout } from "@/components";
import { Chat } from "@/pages/index";
import ReactDOM from "react-dom/client";
import "./index.css";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <Chat />
    </Layout>
  </React.StrictMode>
);
