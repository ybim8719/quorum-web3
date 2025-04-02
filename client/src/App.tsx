import "./App.css";
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useAccount } from "wagmi";
import { GlobalContext } from "./context/globalContext";
import { useReadManagerQueries } from "./hooks/useReadManagerQueries";
import { useReadTokenQueries } from "./hooks/useReadTokenQueries";
import { useReadBallotQueries } from "./hooks/useReadBallotQueries";
import { OWNER_ROLE, CUSTOMER_ROLE } from "./models/roles";
import { isZeroAddress } from "./models/utils";
import ERC20 from "./pages/ERC20";
import Home from "./pages/Home";
import Layout from "./components/UI/Layout";
import { TOKEN_STATUS_INSTRUCTIONS } from "./models/ERC20";
import Ballot from "./pages/Ballot";
import { BALLOT_STATUS_INSTRUCTIONS } from "./models/ballot";

function App() {
  const { address: connectedAccount } = useAccount();
  const globalCtx = useContext(GlobalContext);
  // use read queries from contracts
  const {
    useFetchedOwner,
    useFetchedCustomersAddresses,
    useFetchedERC20Address,
  } = useReadManagerQueries(globalCtx.deployedManagerAddress);
  const { useFetchedERC20CurrentStatus } = useReadTokenQueries(globalCtx.erc20Address);
  const { useFetchedBallotStatus } = useReadBallotQueries(globalCtx.deployedBallotAddress);
  const { data: fetchedOwnerData } = useFetchedOwner;
  const { data: fetchedCustomersAddressesData } = useFetchedCustomersAddresses;
  const { data: fetchedERC20Data } = useFetchedERC20Address;
  const { data: fetchERC20CurrentStatusData, refetch: refetchERC20CurrentStatus } = useFetchedERC20CurrentStatus;
  const { data: fetchBallotCurrentStatusData, refetch: refetchBallotCurrentStatus } = useFetchedBallotStatus;

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
        (fetchedCustomersAddressesData as string[]).includes(connectedAccount as string)
      ) {
        console.log('went 56')
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
      refetchERC20CurrentStatus();
    }
  }, [fetchedERC20Data]);

  useEffect(() => {
    if (fetchERC20CurrentStatusData !== undefined) {
      const currentStatusKey = Object.keys(TOKEN_STATUS_INSTRUCTIONS).find((key) => {
        return TOKEN_STATUS_INSTRUCTIONS[key].statusId === fetchERC20CurrentStatusData;
      });
      if (currentStatusKey) {
        globalCtx.setErc20Status(currentStatusKey);
      }
    }

    if (fetchBallotCurrentStatusData !== undefined) {
      const currentStatusKey = Object.keys(BALLOT_STATUS_INSTRUCTIONS).find((key) => {
        return BALLOT_STATUS_INSTRUCTIONS[key].statusId === fetchBallotCurrentStatusData;
      });
      if (currentStatusKey) {
        globalCtx.setBallotStatus(currentStatusKey);
      }
    }

  }, [fetchERC20CurrentStatusData, fetchBallotCurrentStatusData]);

  const routes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/erc20" element={<ERC20 onRefetchStatus={refetchERC20CurrentStatus} />} />
      <Route path="/ballot" element={<Ballot onRefetchStatus={refetchBallotCurrentStatus} />} />
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
