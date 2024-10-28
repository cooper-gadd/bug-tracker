import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./app.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(
              `https://solace.ist.rit.edu/~ctg7866/ISTE341/bug-tracker/api${url}`,
            ).then((res) => res.json()),
        }}
      >
        <App />
      </SWRConfig>
    </ThemeProvider>
  </StrictMode>,
);
