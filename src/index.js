import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify"; // ToastContainer 추가
import "react-toastify/dist/ReactToastify.css"; // 스타일 파일 추가
import App from "./App";
import "./index.css";
import "./styles/Responsive.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <>
      <App />
      <ToastContainer position="top-right" autoClose={3000} /> {/* ToastContainer 추가 */}
    </>
  </React.StrictMode>
);

