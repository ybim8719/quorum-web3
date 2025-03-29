import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/globalContext";
import { Modal } from "../components/UI/Modal";
import { useAccount } from "wagmi";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles";
import { isZeroAddress } from "../models/utils";
import VerifyInitialMinting from "../components/shared/ERC20/VerifyInitialMinting";
import { triggerReadContract } from "../hooks/useReadTokenQueries";

function ERC20() {
  const { isConnected } = useAccount();
  const globalCtx = useContext(GlobalContext);
  const [modalInfoText, setModalInfoText] = useState<string | null>(null);
  const [ERC20Status, setERC20Status] = useState();


  useEffect(() => {
    const truc = async () => {
      return await triggerReadContract(globalCtx.erc20Address, globalCtx.deployedManagerAddress);
    }
    const response = truc();
    console.log(response, "ftch balance of owner in token ")
    // fetch ERC20 status 
    // fetch balance of owner
    // fetch totalSupply
  }, []);


  if (!isConnected) {
    return <h1>Please connect your wallet first</h1>;
  }

  if (globalCtx.role !== OWNER_ROLE && globalCtx.role !== CUSTOMER_ROLE) {
    return <h1>Unauthorized</h1>;
  }

  if (isZeroAddress(globalCtx.erc20Address)) {
    return <p>NO ERC20 deployed yet</p>;
  }

  const onChangeHandler = () => {
    // confirm total minted and procedd to opening of shares transfer to token
  }

  // if status if minting
  let mainContent = <VerifyInitialMinting balanceOfOwner={10000} totalSupply={10000} onChangeStatus={onChangeHandler} role={globalCtx.role} />
  // button close status
  return (
    <div>
      <h1>ERC20 TOKEN Status</h1>
      <p>CURRENT ERC20 Status: XXXX</p>




      {modalInfoText && (
        <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>
      )}
      {/* {isLoading && <LoadingIndicator />} */}
    </div>
  );
}

export default ERC20;
