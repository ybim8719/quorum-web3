import { useContext, useState } from "react";
import { GlobalContext } from "../context/globalContext";
import { Modal } from "../components/UI/Modal";
import { useAccount } from "wagmi";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles";
import { isZeroAddress } from "../models/utils";

function ERC20() {
  const { isConnected } = useAccount();
  const globalCtx = useContext(GlobalContext);
  const [modalInfoText, setModalInfoText] = useState<string | null>(null);

  if (!isConnected) {
    return <h1>Please connect your wallet first</h1>;
  }

  if (globalCtx.role !== OWNER_ROLE && globalCtx.role !== CUSTOMER_ROLE) {
    return <h1>Unauthorized</h1>;
  }

  if (isZeroAddress(globalCtx.erc20Address)) {
    return <p>NO ERC20 deployed yet</p>;
  }
  // table of lots with lotinfo + customer attached + btn transfert / or verify to get the token contract directly

  // button close status
  return (
    <div>
      <h1>ERC20 TOKEN Status</h1>
      <p>CURRENT Status: XXXX</p>
      <p>Total shares transformed to token /1000 </p>

      {modalInfoText && (
        <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>
      )}
      {/* {isLoading && <LoadingIndicator />} */}
    </div>
  );
}

export default ERC20;
