import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/globalContext";
import { Modal, NonClosableModal } from "../components/UI/Modal";
import { useAccount } from "wagmi";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles";
import { isZeroAddress } from "../models/utils";
import {
    useSubmitProposal,
    useSetProposalsSubmittingClosed,
    useSetProposalBeingDiscussedStatusOrEndBallot,
    useSetProposalVotingOpenStatus,
    useVoteForCurrentProposal, useSetCurrentProposalVotingCountReveal,
    useLockContract
    ,
} from "../hooks/useWriteBallotActions";
import LoadingIndicator from "../components/UI/LoadingIndicator.tsx";
import ErrorBlock from "../components/UI/ErrorBlock.tsx";
import { useReadBallotQueries } from "../hooks/useReadBallotQueries.ts";
import StatusInstructions from "../components/shared/Ballot/StatusInstructions.tsx";


interface IBallotProps {
    onRefetchStatus: () => void;
}

function Ballot({ onRefetchStatus }: IBallotProps) {
    const { address: connectedAccount, isConnected } = useAccount();
    const globalCtx = useContext(GlobalContext);
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // read hooks
    // const { useFetchedTotalSupply } = useReadTokenQueries(globalCtx.erc20Address);
    // const { useFetchedLots } = useReadManagerQueries(globalCtx.deployedManagerAddress);

    // const {
    //     hash: validateMintingHash,
    //     error: validateMintingError,
    //     isConfirmed: validateMintingIsConfirmed,
    //     validateMintingWrite
    // } = useValidateMinting();

    // const {
    //     hash: transferSharesHash,
    //     error: transferSharesError,
    //     isConfirmed: transferSharesIsConfirmed,
    //     transferSharesWrite
    // } = useTranferShares();

    // useEffect(() => {
    //     const getBalance = async (addressToConsult: string) => {
    //         return triggerGetBalance(globalCtx.erc20Address, addressToConsult);
    //     }
    //     if (globalCtx.erc20Address) {
    //         const response = getBalance(globalCtx.deployedManagerAddress);
    //         response
    //             .then((truc: any) => {
    //                 setOwnersBalance(Number(truc));
    //             }).catch((e) => {
    //                 console.log(e)
    //             })
    //     }
    // }, [globalCtx.erc20Address]);


    // useEffect(() => {
    //     if (validateMintingIsConfirmed) {
    //         setIsLoading(false);
    //         setModalInfoText("Transaction confirmed");
    //         // set current status passed to "transfering shares and reload page
    //         onRefetchStatus();
    //     }
    // }, [validateMintingIsConfirmed]);


    if (!isConnected) {
        return <h1>Please connect your wallet first</h1>;
    }

    if (globalCtx.role !== OWNER_ROLE && globalCtx.role !== CUSTOMER_ROLE) {
        return <h1>Unauthorized</h1>;
    }

    if (isZeroAddress(globalCtx.deployedBallotAddress) || globalCtx.deployedBallotAddress === undefined) {
        return <p>NO GM Ballot deployed yet</p>;
    }

    // const onVerifyShares = (lot: Lot) => {
    //     setIsLoading(true);
    //     const getBalance = async (addressToConsult: string) => {
    //         return triggerGetBalance(globalCtx.erc20Address, addressToConsult);
    //     }
    //     if (globalCtx.erc20Address && lot?.customer?.address) {
    //         const response = getBalance(lot.customer.address);
    //         response
    //             .then((balance: any) => {
    //                 setLotBeingVerified((prev: IlotBeingVerified) => {
    //                     return {
    //                         ...prev,
    //                         balanceOf: balance
    //                     }
    //                 })
    //                 setIsLoading(false);
    //             }).catch((e) => {
    //                 setError('fetch baklance of owner failed');
    //             })
    //     }
    // }


    // Array of modals
    // let modals = [];
    // if (error) {
    //     modals.push(
    //         <Modal onClose={() => setError(null)}>
    //             <ErrorBlock title="OUPS" message={error} />
    //         </Modal>,
    //     );
    // }
    // if (modalInfoText) {
    //     modals.push(
    //         <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>,
    //     );
    // }

    // if (isLoading) {
    //     modals.push(
    //         <NonClosableModal>
    //             <>
    //                 <h2>Transaction being processed</h2>
    //                 <LoadingIndicator />
    //                 {/* <p>Tx Hash: {currentHash}</p> */}
    //             </>
    //         </NonClosableModal>,
    //     );
    // }


    return (
        <div>
            <h1>General meeting ! (Ballot)</h1>
            <StatusInstructions status={globalCtx.ballotStatus} role={globalCtx.role} />

            {/* {modals} */}
        </div>
    );
}

export default Ballot;
