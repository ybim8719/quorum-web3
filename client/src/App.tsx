import "./App.css";
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAccount } from "wagmi";
import { UserContext } from "./context/userContext";
import { useReadManagerQueries } from "./hooks/useReadManagerQueries";
import { OWNER_ROLE, CUSTOMER_ROLE } from "./models/roles";
import { adressZero } from "./models/ERC20";
import ERC20 from "./pages/ERC20";
import Home from "./pages/Home";
import Layout from "./components/UI/Layout";


function App() {
  const { address: connectedAccount } = useAccount();
  const userCtx = useContext(UserContext);
  // read MANAGER Contract queries
  const { useFetchedOwner, useFetchedCustomersAddresses, useFetchedERC20Adress } = useReadManagerQueries();
  const { data: fetchedOwnerData, refetch: refetchOwner } = useFetchedOwner;
  const { data: fetchedCustomersAddressesData, refetch: refetchCustomersAddresses } = useFetchedCustomersAddresses;
  const { data: fetchedERC20Data, refetch: refetchERC20 } = useFetchedERC20Adress;

  useEffect(() => {
    if (
      fetchedOwnerData !== undefined &&
      fetchedOwnerData !== null &&
      fetchedCustomersAddressesData !== undefined &&
      fetchedCustomersAddressesData !== null &&
      connectedAccount
    ) {
      // owner and customers addresses are mandatory to set the role 
      userCtx.setCustomersAddresses(fetchedCustomersAddressesData as string[]);
      userCtx.setOwner(fetchedOwnerData.toString());
      if (connectedAccount === fetchedOwnerData.toString()) {
        userCtx.setRole(OWNER_ROLE);
      } else if (userCtx.customersAddresses.includes(connectedAccount as string)) {
        userCtx.setRole(CUSTOMER_ROLE);
      }
    }
  }, [connectedAccount, fetchedOwnerData, fetchedCustomersAddressesData]);

  useEffect(() => {
    if (
      fetchedERC20Data !== undefined &&
      fetchedERC20Data !== null &&
      fetchedERC20Data !== adressZero
    ) {
      userCtx.setErc20Address(fetchedERC20Data.toString());
    }
  }, [fetchedERC20Data]);


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
