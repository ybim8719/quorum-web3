import { useAccount } from "wagmi";
import "./App.css";
import { useContext } from "react";
import { UserContext } from "./context/userContext";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Unauthorized from "./components/shared/Unauthorized";
import Layout from "./components/UI/Layout";

function App() {
  const { address, isConnected } = useAccount();
  const userCtx = useContext(UserContext);

  let routes = <Route path="/*" element={<Unauthorized />} />;
  if (userCtx.isAuthorized) {
    routes = <>
      <Route path="/" element={<Home />} />
    </>
  }

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
