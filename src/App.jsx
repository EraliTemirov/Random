import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage, { checkAuthToken } from "./Pages/HomePage";
import Register from "./Pages/Regester";
import "./App.css";

function App() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const handleRegister = () => {
    setIsRegistered(true);
  };
  useEffect(() => {
    checkAuthToken()
      .then(() => {
        setIsRegistered(true);
      })
      .catch((error) => {
        console.error("Autentifikatsiya xatosi:", error);
        setIsRegistered(false);
      });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isRegistered ? (
            <Navigate to="/home" />
          ) : (
            <Register onRegister={handleRegister} />
          )
        }
      />
      <Route
        path="/home"
        element={isRegistered ? <HomePage /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
