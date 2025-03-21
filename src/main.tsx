import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import FrontPage from "./components/front-page";
import "bulma/css/versions/bulma-no-helpers-prefixed.css";
import "./styles/global.css";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <FrontPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MDXProvider>
      <RouterProvider router={router} />
    </MDXProvider>
  </React.StrictMode>,
);
