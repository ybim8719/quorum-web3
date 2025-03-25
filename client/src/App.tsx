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
  const { data: fetchedOwnerData, refetch: refetchOwner } = useFetchedOwner;
  const { data: fetchedCustomersAddressesData, refetch: refetchCustomersAddresses } = useFetchedCustomersAddresses;
  const { data: fetchedERC20Data, refetch: refetchERC20 } = useFetchedERC20Adress;

  useEffect(() => {
    console.log("in useeffect")
    if (
      fetchedOwnerData !== undefined &&
      fetchedOwnerData !== null &&
      fetchedCustomersAddressesData !== undefined &&
      fetchedCustomersAddressesData !== null &&
      connectedAccount
    ) {
      console.log(fetchedOwnerData, "fetchedOwnerData")
      console.log(fetchedCustomersAddressesData, "fetchedCustomersAddressesData")
      userCtx.setCustomersAddresses(fetchedCustomersAddressesData as string[]);
      userCtx.setOwner(fetchedOwnerData.toString());
      if (connectedAccount === fetchedOwnerData.toString()) {
        console.log('is admin')
        userCtx.setRole(OWNER_ROLE);
      }
      else if (userCtx.customersAddresses.includes(connectedAccount as string)) {
        userCtx.setRole(CUSTOMER_ROLE);
      }
    }

    if (fetchedERC20Data !== undefined && fetchedERC20Data !== null) {
      console.log(fetchedERC20Data, "fetchedERC20Data")
      userCtx.setErc20Address(fetchedERC20Data.toString());
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
