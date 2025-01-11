import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { RouterProvider } from "react-router";
import { store } from "./redux/app/store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
// import { router } from "./Routes/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <RouterProvider router={router}/> */}

      <App/>
    </Provider>
  </StrictMode>
);
