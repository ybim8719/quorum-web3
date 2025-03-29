import "./App.css";
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAccount } from "wagmi";
import { GlobalContext } from "./context/globalContext";
import { useReadManagerQueries } from "./hooks/useReadManagerQueries";
import { useReadTokenQueries } from "./hooks/useReadTokenQueries";

import { OWNER_ROLE, CUSTOMER_ROLE } from "./models/roles";
import { isZeroAddress } from "./models/utils";
import ERC20 from "./pages/ERC20";
import Home from "./pages/Home";
import Layout from "./components/UI/Layout";
import { TOKEN_STATUS_INSTRUCTIONS } from "./models/ERC20";


function App() {
  const { address: connectedAccount } = useAccount();
  const globalCtx = useContext(GlobalContext);
  // read MANAGER Contract queries
  const {
    useFetchedOwner,
    useFetchedCustomersAddresses,
    useFetchedERC20Adress,
  } = useReadManagerQueries(globalCtx.deployedManagerAddress);


  const {
    useFetchedCurrentStatus,
  } = useReadTokenQueries(globalCtx.erc20Address);


  const { data: fetchedOwnerData, refetch: refetchOwner } = useFetchedOwner;
  const {
    data: fetchedCustomersAddressesData,
    refetch: refetchCustomersAddresses,
  } = useFetchedCustomersAddresses;
  const { data: fetchedERC20Data, refetch: refetchERC20 } =
    useFetchedERC20Adress;
  const { data: fetchCurrentStatusData, error: errorStatus, refetch: refetchCurrentStatus } =
    useFetchedCurrentStatus;
  // fetch customers /owner addresses to apply authentication 
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


  // fetch ERC20 contract is exist to handle access to token Page
  useEffect(() => {
    if (
      fetchedERC20Data !== undefined &&
      fetchedERC20Data !== null &&
      isZeroAddress(fetchedERC20Data as string) === false
    ) {
      globalCtx.setErc20Address(fetchedERC20Data.toString());
      refetchCurrentStatus();
    }
  }, [fetchedERC20Data]);

  useEffect(() => {
    if (fetchCurrentStatusData !== undefined) {
      const currentStatusKey = Object.keys(TOKEN_STATUS_INSTRUCTIONS).find((key) => {
        return TOKEN_STATUS_INSTRUCTIONS[key].statusId === fetchCurrentStatusData;
      });
      if (currentStatusKey) {
        globalCtx.setErc20Status(currentStatusKey);
      }
    }

  }, [fetchCurrentStatusData]);

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
