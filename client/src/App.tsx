import "./App.css";
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAccount } from "wagmi";
import { UserContext } from "./context/userContext";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import Layout from "./components/UI/Layout";
import { useWalletQueries } from "./hooks/useWalletQueries";
import { OWNER_ROLE, UNAUTHORIZED_ROLE, CUSTOMER_ROLE } from "./models/roles";
import ERC20 from "./pages/Token";


function App() {
  const { address: connectedAccount } = useAccount();
  const userCtx = useContext(UserContext);
  // read contracts queries
  const { useFetchedOwner, useFetchedCustomersAddresses } = useWalletQueries();
  const { data: fetchedOwnerData, error: fetchedOwnerError, refetch: refetchOwner } = useFetchedOwner;
  const { data: fetchedCustomersAddressesData, error: fetchedCustomersAddressesError, refetch: refetchCustomersAddresses } = useFetchedCustomersAddresses;


  useEffect(() => {
    if (fetchedOwnerData !== undefined && fetchedOwnerData !== null) {
      console.log(fetchedOwnerData, "fetchedOwnerData")
      userCtx.setOwner(fetchedOwnerData.toString());
    }
    if (fetchedCustomersAddressesData !== undefined && fetchedCustomersAddressesData !== null) {
      console.log(fetchedCustomersAddressesData, "fetchedCustomersAddressesData")
      // userCtx.setCustomersAddresses(fetchedCustomersAddressesData.toString());
    }

    //TODO check if erc20 is deployed
    if (connectedAccount === userCtx.owner) {
      userCtx.setRole(OWNER_ROLE);
    }
    else if (userCtx.customersAddresses.includes(connectedAccount as string)) {
      userCtx.setRole(CUSTOMER_ROLE);
    }

  }, [connectedAccount]);


  let routes = <Route path="/*" element={<Unauthorized />} />;
  if (userCtx.isAuthorized) {
    routes = <>
      <Route path="/" element={<Home />} />
      <Route path="/erc20" element={<ERC20 />} />
      {/* and so on....   */}
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
