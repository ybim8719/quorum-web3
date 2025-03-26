import "./App.css";
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAccount } from "wagmi";
import { GlobalContext } from "./context/globalContext";
import { useReadManagerQueries } from "./hooks/useReadManagerQueries";
import { OWNER_ROLE, CUSTOMER_ROLE } from "./models/roles";
import { adressZero } from "./models/ERC20";
import ERC20 from "./pages/ERC20";
import Home from "./pages/Home";
import Layout from "./components/UI/Layout";
import { } from "../constants/deployed";

function App() {
  const { address: connectedAccount } = useAccount();
  const globalCtx = useContext(GlobalContext);
  // read MANAGER Contract queries
  const {
    useFetchedOwner,
    useFetchedCustomersAddresses,
    useFetchedERC20Adress,
  } = useReadManagerQueries(globalCtx.deployedManagerAddress);
  const { data: fetchedOwnerData, refetch: refetchOwner } = useFetchedOwner;
  const {
    data: fetchedCustomersAddressesData,
    refetch: refetchCustomersAddresses,
  } = useFetchedCustomersAddresses;
  const { data: fetchedERC20Data, refetch: refetchERC20 } =
    useFetchedERC20Adress;

  useEffect(() => {
    if (
      fetchedOwnerData !== undefined &&
      fetchedOwnerData !== null &&
      fetchedCustomersAddressesData !== undefined &&
      fetchedCustomersAddressesData !== null &&
      connectedAccount
    ) {
      // owner and customers addresses are mandatory to set the role
      globalCtx.setCustomersAddresses(fetchedCustomersAddressesData as string[]);
      globalCtx.setOwner(fetchedOwnerData.toString());
      if (connectedAccount === fetchedOwnerData.toString()) {
        globalCtx.setRole(OWNER_ROLE);
      } else if (
        globalCtx.customersAddresses.includes(connectedAccount as string)
      ) {
        globalCtx.setRole(CUSTOMER_ROLE);
      }
    }
  }, [connectedAccount, fetchedOwnerData, fetchedCustomersAddressesData]);

  useEffect(() => {
    if (
      fetchedERC20Data !== undefined &&
      fetchedERC20Data !== null &&
      fetchedERC20Data !== adressZero
    ) {
      globalCtx.setErc20Address(fetchedERC20Data.toString());
    }
  }, [fetchedERC20Data]);

  const routes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/erc20" element={<ERC20 />} />
      {/* and so on....   */}
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
