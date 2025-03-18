import { useAccount } from "wagmi";
import "./App.css";
import React, { useContext } from "react";
import { UserContext } from "./context/userContext";
import { BrowserRouter, Routes, Route } from "react-router";
import HomeAdmin from "./pages/AdminHome";
import CustomerHome from "./pages/CustomerHome";

function App() {
  const { address } = useAccount();
  const userCtx = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeAdmin />} />
        <Route path="/truc" element={<CustomerHome />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
