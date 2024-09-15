import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "next-themes";
import { ConvexReactClient } from "convex/react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import Chat from "@/components/Chat.tsx";
import "./index.css";

// const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class">
    <Auth0Provider
      domain="dev-6ztti4mri8vg26fg.ca.auth0.com"
      clientId="qXduf1p8cJI82SXYXI6saXkIwOq41UTB"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </ThemeProvider>,
);
