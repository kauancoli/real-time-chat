import { Layout } from "@/components";
import { Router } from "@/router";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Layout>
      <Router />
    </Layout>
  </AuthProvider>
);
