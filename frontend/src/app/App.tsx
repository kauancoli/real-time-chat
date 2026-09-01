import { Layout } from "@/components";
import { AppProviders } from "./providers/AppProviders";
import { AppRouter } from "./router/AppRouter";

export function App() {
  return (
    <AppProviders>
      <Layout>
        <AppRouter />
      </Layout>
    </AppProviders>
  );
}
