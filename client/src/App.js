import React from "react";
import { Routes, Route } from "react-router-dom";
import { history } from "helpers/history";
import CustomRouter from "./CustomRouter";
import HomePage from "./views/home/HomePage";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";

function App() {
  return (
    <CustomRouter history={history}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </CustomRouter>
  );
}

export default App;
