import { Layout } from "@/components";
import { Chat } from "@/pages/index";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Layout>
    <Chat />
  </Layout>
);
