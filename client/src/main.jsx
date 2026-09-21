import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <div>
    <App />
    <ToastContainer theme="dark" autoClose={2000} />
  </div>
);
