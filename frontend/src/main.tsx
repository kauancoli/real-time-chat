import { Layout } from "@/components";
import { Chat } from "@/pages/index";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <Chat />
    </Layout>
  </React.StrictMode>
);
