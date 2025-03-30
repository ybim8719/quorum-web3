import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/globalContext";
import { Modal, NonClosableModal } from "../components/UI/Modal";
import { useAccount } from "wagmi";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles";
import { isZeroAddress } from "../models/utils";
import VerifyInitialMinting from "../components/shared/ERC20/VerifyInitialMinting";
import { triggerGetBalance, useReadTokenQueries } from "../hooks/useReadTokenQueries";
import { CONTRACT_LOCK_KEY, INITIAL_MINTING_KEY, TOKEN_STATUS_INSTRUCTIONS, TRANSFERING_SHARES_KEY } from "../models/ERC20";
import {
  useValidateMinting, useTranferShares
} from "../hooks/useWriteTokenActions..ts";
import LoadingIndicator from "../components/UI/LoadingIndicator.tsx";
import ErrorBlock from "../components/UI/ErrorBlock.tsx";
import TokenizedLots from "../components/shared/ERC20/TokenizedLots.tsx";
import { Lot } from "../models/lots.ts";
import { useReadManagerQueries } from "../hooks/useReadManagerQueries.ts";


interface IlotBeingVerified {
  lot: Lot | null,
  balanceOf: number | null,
}

const EmptyLotBeingVerified = {
  lot: null,
  balanceOf: null
}

interface IERC20Props {
  onRefetchStatus: () => void;
}

function ERC20({ onRefetchStatus }: IERC20Props) {
  const { address: connectedAccount, isConnected } = useAccount();
  const globalCtx = useContext(GlobalContext);
  const [modalInfoText, setModalInfoText] = useState<string | null>(null);
  const [ownersBalance, setOwnersBalance] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lots, setLots] = useState<Lot[]>([]);
  const [lotBeingVerified, setLotBeingVerified] = useState<IlotBeingVerified>(EmptyLotBeingVerified)
  // read hooks
  const { useFetchedTotalSupply } = useReadTokenQueries(globalCtx.erc20Address);
  const { data: fetchedTotalSupplyData, refetch: refetchTotalSupply } = useFetchedTotalSupply;
  const { useFetchedLots, } = useReadManagerQueries(globalCtx.deployedManagerAddress);
  const { data: fetchedLotsData, refetch: refetchLots } = useFetchedLots;


  const {
    hash: validateMintingHash,
    error: validateMintingError,
    isConfirmed: validateMintingIsConfirmed,
    validateMintingWrite
  } = useValidateMinting();

  const {
    hash: transferSharesHash,
    error: transferSharesError,
    isConfirmed: transferSharesIsConfirmed,
    transferSharesWrite
  } = useTranferShares();


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

  useEffect(() => {
    if (
      fetchedLotsData !== undefined &&
      fetchedLotsData !== null
    ) {
      if (Array.isArray(fetchedLotsData) && fetchedLotsData.length > 0) {
        const formatedLots = fetchedLotsData.map((lot) => {
          let formatedLot: Lot = {
            id: Number(lot.id),
            shares: Number(lot.shares),
            isTokenized: lot.isTokenized,
            lotOfficialNumber: lot.lotOfficialNumber,
          };
          if (isZeroAddress(lot.customerAddress) === false) {
            formatedLot.customer = {
              address: lot.customerAddress,
              firstName: lot.firstName,
              lastName: lot.lastName,
            };
          }
          return formatedLot;
        });
        setLots(formatedLots);
      }
    }
  }, [fetchedLotsData]);


  useEffect(() => {
    if (validateMintingIsConfirmed) {
      setIsLoading(false);
      setModalInfoText("Transaction confirmed");
      // set current status passed to "transfering shares and reload page
      onRefetchStatus();
    }
  }, [validateMintingIsConfirmed]);

  useEffect(() => {
    if (
      (transferSharesIsConfirmed)
    ) {
      setIsLoading(false);
      setModalInfoText("Transaction confirmed");
      onRefetchStatus();
      refetchLots();
    }

  }, [transferSharesIsConfirmed]);

  if (!isConnected) {
    return <h1>Please connect your wallet first</h1>;
  }

  if (globalCtx.role !== OWNER_ROLE && globalCtx.role !== CUSTOMER_ROLE) {
    return <h1>Unauthorized</h1>;
  }

  if (isZeroAddress(globalCtx.erc20Address) || globalCtx.erc20Address === undefined) {
    return <p>NO ERC20 deployed yet</p>;
  }

  // 
  const onValidateMintingHandler = () => {
    if (globalCtx.deployedManagerAddress) {
      setIsLoading(true);
      validateMintingWrite(connectedAccount, globalCtx.deployedManagerAddress);
    }
  }

  const onTransferSharesHandler = (lot: Lot) => {
    setIsLoading(true);
    transferSharesWrite(connectedAccount, globalCtx.deployedManagerAddress, lot.id);
  }

  const onCreateBallotHandler = () => {
    setIsLoading(true);
    // usewrite, call manager functionn that deployed the new ballot contract
  }

  const onVerifyShares = (lot: Lot) => {
    setIsLoading(true);
    setLotBeingVerified((prev: IlotBeingVerified) => {
      return {
        ...prev,
        lot: lot
      }
    })

    const getBalance = async (addressToConsult: string) => {
      return triggerGetBalance(globalCtx.erc20Address, addressToConsult);
    }
    if (globalCtx.erc20Address && lot?.customer?.address) {
      const response = getBalance(lot.customer.address);
      response
        .then((balance: any) => {
          setLotBeingVerified((prev: IlotBeingVerified) => {
            return {
              ...prev,
              balanceOf: balance
            }
          })
          setIsLoading(false);
        }).catch((e) => {
          setError('fetch baklance of owner failed');
        })
    }
  }

  let mainContent;
  if (globalCtx.erc20Status === INITIAL_MINTING_KEY && totalSupply && ownersBalance) {
    mainContent = <VerifyInitialMinting balanceOfOwner={ownersBalance} totalSupply={totalSupply} onValidate={onValidateMintingHandler} role={globalCtx.role} currentStatus={globalCtx.erc20Status} />
  }

  if (globalCtx.erc20Status === TRANSFERING_SHARES_KEY || globalCtx.erc20Status === CONTRACT_LOCK_KEY) {
    mainContent = <TokenizedLots role={globalCtx.role} lots={lots} balanceOfOwner={ownersBalance} onVerify={onVerifyShares}
      onTokenize={onTransferSharesHandler} />
  }

  // Array of modals
  let modals = [];
  if (error) {
    modals.push(
      <Modal onClose={() => setError(null)}>
        <ErrorBlock title="OUPS" message={error} />
      </Modal>,
    );
  }
  if (modalInfoText) {
    modals.push(
      <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>,
    );
  }

  if (isLoading) {
    modals.push(
      <NonClosableModal>
        <>
          <h2>Transaction being processed</h2>
          <LoadingIndicator />
          {/* <p>Tx Hash: {currentHash}</p> */}
        </>
      </NonClosableModal>,
    );
  }

  if (lotBeingVerified?.lot) {
    modals.push(
      <Modal onClose={() => setLotBeingVerified(EmptyLotBeingVerified)}>
        <p>
          ID LOT SHARES théoriques : {lotBeingVerified.lot.shares}
        </p>
        <p>
          Consulté sur ERC20 : {lotBeingVerified.balanceOf}
        </p>
      </Modal>,
    )
  }

  return (
    <div>
      <h1>Shares Referential (ERC20)</h1>
      <p>Current Status: {globalCtx.erc20Status}</p>
      {globalCtx.erc20Status === CONTRACT_LOCK_KEY && globalCtx.ballotAddress !== undefined &&
        <div>
          <p>Create new general meeting ? </p>
          <button
            className="nes-btn is-success"
            onClick={() => onCreateBallotHandler()}
          >
            GO CREATE GM !
          </button>
        </div>
      }
      {globalCtx.ballotAddress && <p className="notification">General meeting is Created ! Switch to Ballot page !</p>}
      {mainContent}
      {modals}
    </div>
  );
}

export default ERC20;
