// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

// الحصول على عنصر الجذر وتكوين React 18
const container = document.getElementById("root");
const root = createRoot(container);

// عرض التطبيق مع جميع المقدمات (Providers) المطلوبة
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
