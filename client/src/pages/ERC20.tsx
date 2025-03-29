import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/globalContext";
import { Modal } from "../components/UI/Modal";
import { useAccount } from "wagmi";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles";
import { isZeroAddress } from "../models/utils";
import VerifyInitialMinting from "../components/shared/ERC20/VerifyInitialMinting";
import { triggerGetBalance, useReadTokenQueries } from "../hooks/useReadTokenQueries";
import { CONTRACT_LOCK_KEY, INITIAL_MINTING_KEY, TOKEN_STATUS_INSTRUCTIONS, TRANSFERING_SHARES_KEY } from "../models/ERC20";
import {
  useValidateMinting
} from "../hooks/useWriteTokenActions..ts";

function ERC20() {
  const { address: connectedAccount, isConnected } = useAccount();
  const globalCtx = useContext(GlobalContext);
  const [modalInfoText, setModalInfoText] = useState<string | null>(null);
  const [ownersBalance, setOwnersBalance] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<number>(0)

  // read hooks
  const { useFetchedTotalSupply } = useReadTokenQueries(globalCtx.erc20Address);
  const { data: fetchedTotalSupplyData, refetch: refetchTotalSupply } = useFetchedTotalSupply;
  const {
    hash: validateMintingHash,
    error: validateMintingError,
    isConfirmed: validateMintingIsConfirming,
    validateMintingWrite
  } = useValidateMinting();
  useEffect(() => {
    const getBalance = async (addressToConsult: string) => {
      return triggerGetBalance(globalCtx.erc20Address, addressToConsult);
    }
    if (globalCtx.erc20Address) {
      const response = getBalance(globalCtx.deployedManagerAddress);
      response
        .then((truc: any) => {
          setOwnersBalance(Number(truc));
        }).catch((e) => {
          console.log(e)
        })
    }
  }, [globalCtx.erc20Address]);

  useEffect(() => {
    if (fetchedTotalSupplyData) {
      setTotalSupply(Number(fetchedTotalSupplyData) as number);
    }
  }, [fetchedTotalSupplyData]);


  if (!isConnected) {
    return <h1>Please connect your wallet first</h1>;
  }

  if (globalCtx.role !== OWNER_ROLE && globalCtx.role !== CUSTOMER_ROLE) {
    return <h1>Unauthorized</h1>;
  }

  if (isZeroAddress(globalCtx.erc20Address)) {
    return <p>NO ERC20 deployed yet</p>;
  }

  // 
  const onValidateMintingHandler = () => {
    if (globalCtx.deployedManagerAddress) {
      // DO MODAL AND STUFF
      validateMintingWrite(connectedAccount, globalCtx.deployedManagerAddress);
    }
  }

  let mainContent;
  if (globalCtx.erc20Status === INITIAL_MINTING_KEY && totalSupply && ownersBalance) {
    mainContent = <VerifyInitialMinting balanceOfOwner={ownersBalance} totalSupply={totalSupply} onValidate={onValidateMintingHandler} role={globalCtx.role} />
  }

  if (globalCtx.erc20Status === TRANSFERING_SHARES_KEY) {
    // show list of lots to tokenize 
    // props : lots + customers + is verified + 
    // tokenize onclick
    // verifiy on click 
  }

  if (globalCtx.erc20Status === CONTRACT_LOCK_KEY) {
    // final page: lots tokzneized + verify button
    // div alert saying thta contract is locked
  }


  return (
    <div>
      <h1>ERC20 TOKEN Status</h1>
      <p>CURRENT ERC20 Status: {globalCtx.erc20Status}</p>
      {mainContent}
      {modalInfoText && (
        <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>
      )}
      {/* {isLoading && <LoadingIndicator />} */}
    </div>
  );
}

export default ERC20;
