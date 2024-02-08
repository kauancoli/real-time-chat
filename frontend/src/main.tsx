import { Layout } from "@/components";
import { Router } from "@/router";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Layout>
    <Router />
  </Layout>
);
