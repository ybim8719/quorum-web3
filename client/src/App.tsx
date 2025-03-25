import "./App.css";
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAccount } from "wagmi";
import { UserContext } from "./context/userContext";
import Home from "./pages/Home";
import Layout from "./components/UI/Layout";
import { useReadManagerQueries } from "./hooks/useReadManagerQueries";
import { OWNER_ROLE, CUSTOMER_ROLE, ADMIN_ROLE } from "./models/roles";
import ERC20 from "./pages/ERC20";


function App() {
  const { address: connectedAccount } = useAccount();
  const userCtx = useContext(UserContext);
  // read MANAGER Contract queries
  const { useFetchedOwner, useFetchedCustomersAddresses, useFetchedERC20Adress } = useReadManagerQueries();
  const { data: fetchedOwnerData, error: fetchedOwnerError, refetch: refetchOwner } = useFetchedOwner;
  const { data: fetchedCustomersAddressesData, error: fetchedCustomersAddressesError, refetch: refetchCustomersAddresses } = useFetchedCustomersAddresses;
  const { data: fetchedERC20Data, error: fetchedERC20Error, refetch: refetchERC20 } = useFetchedERC20Adress;

  // address O 
  // 0x0000000000000000000000000000000000000000 
  useEffect(() => {
    console.log("in useeffect")
    if (fetchedOwnerData !== undefined) {
      console.log(fetchedOwnerData, "fetchedOwnerData2")
      // userCtx.setOwner(fetchedOwnerData.toString());
    }
    if (fetchedCustomersAddressesData !== undefined) {
      console.log(fetchedCustomersAddressesData, "fetchedCustomersAddressesData")
      // userCtx.setCustomersAddresses(fetchedCustomersAddressesData.toString());
    }
    if (fetchedERC20Data !== undefined) {
      console.log(fetchedERC20Data, "fetchedERC20Data")
      // userCtx.setCustomersAddresses(fetchedCustomersAddressesData.toString());
    }

    //TODO check if erc20 is deployed
    if (connectedAccount === userCtx.owner) {
      userCtx.setRole(OWNER_ROLE);
    }
    else if (userCtx.customersAddresses.includes(connectedAccount as string)) {
      userCtx.setRole(CUSTOMER_ROLE);
    }

  }, [connectedAccount, fetchedOwnerData, fetchedCustomersAddressesData, fetchedERC20Data]);


  const routes = <>
    <Route path="/" element={<Home />} />
    <Route path="/erc20" element={<ERC20 />} />
    {/* and so on....   */}
  </>


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
