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
    useVoteForCurrentProposal,
    useSetCurrentProposalVotingCountReveal,
    useLockContract
    ,
} from "../hooks/useWriteBallotActions";
import { useReadBallotQueries } from "../hooks/useReadBallotQueries.ts";

import LoadingIndicator from "../components/UI/LoadingIndicator.tsx";
import ErrorBlock from "../components/UI/ErrorBlock.tsx";
import StatusInstructions from "../components/shared/Ballot/StatusInstructions.tsx";
import Actions from "../components/shared/Ballot/Actions/Actions.tsx";
import DisplayInfos from "../components/shared/Ballot/Display/DisplayInfos.tsx";
import { useloadSharesAndCustomersToBallot } from "../hooks/useWriteManagerActions.ts";


interface IBallotProps {
    onRefetchStatus: () => void;
}

function Ballot({ onRefetchStatus }: IBallotProps) {
    const { address: connectedAccount, isConnected } = useAccount();
    const globalCtx = useContext(GlobalContext);
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minProposals, setMinProposals] = useState<string[]>([]);
    const [allProposalResults, setAllProposalResults] = useState<string[]>([]);

    // Read hooks
    const { useFetchedProposals, useFetchedMinProposals } = useReadBallotQueries(globalCtx.deployedBallotAddress);
    const { data: fetchedMinProposalsData, refetch: refetchMinProposals } = useFetchedMinProposals;

    // Write hooks
    // => OWNER: proposals submitting are OPEN
    const {
        error: loadSharesAndCustomersToBallotError,
        isConfirmed: loadSharesAndCustomersToBallotIsConfirmed,
        loadSharesAndCustomersToBallotWrite
    } = useloadSharesAndCustomersToBallot();

    // => VOTER : my proposal was registered
    const {
        error: submitProposalError,
        isConfirmed: submitProposalIsConfirmed,
        submitProposalWrite
    } = useSubmitProposal();

    // => OWNER: proposals submitting are CLOSED
    const {
        error: setProposalsSubmittingCloseError,
        isConfirmed: setProposalsSubmittingCloseIsClosed,
        setProposalsSubmittingClosedWrite
    } = useSetProposalsSubmittingClosed();

    // => OWNER: current proposal is DISCUSSED / OR GM Ended
    const {
        error: setProposalBeingDiscussedStatusError,
        isConfirmed: setProposalBeingDiscussedStatusIsConfirmed,
        setProposalBeingDiscussedStatusWrite
    } = useSetProposalBeingDiscussedStatusOrEndBallot();

    // => OWNER: current proposal is VOTE OPEN
    const {
        error: setProposalVotingOpenStatusError,
        isConfirmed: setProposalVotingOpenStatusIsConfirmed,
        setProposalVotingOpenStatusWrite
    } = useSetProposalVotingOpenStatus();

    // => VOTER : my VOTE was registered
    const {
        error: voteForCurrentProposalError,
        isConfirmed: voteForCurrentProposalIsConfirmed,
        voteForCurrentProposalWrite
    } = useVoteForCurrentProposal();

    // => OWNER: current proposal is VOTE REVEAL
    const {
        error: setCurrentProposalVotingCountRevealError,
        isConfirmed: setCurrentProposalVotingCountRevealIsConfirmed,
        setCurrentProposalVotingCountRevealWrite
    } = useSetCurrentProposalVotingCountReveal();

    // => OWNER: LOCK CONTRACT
    const {
        error: lockContractError,
        isConfirmed: lockContractIsConfirmed,
        lockContractWrite
    } = useLockContract();

    // watch errors of transactions
    useEffect(() => {
        if (lockContractError ||
            setCurrentProposalVotingCountRevealError ||
            voteForCurrentProposalError ||
            setProposalVotingOpenStatusError ||
            setProposalBeingDiscussedStatusError ||
            setProposalsSubmittingCloseError ||
            submitProposalError ||
            loadSharesAndCustomersToBallotError
        ) {
            setIsLoading(false);
            setError("Transaction failed");
        }
    }, [loadSharesAndCustomersToBallotError, lockContractError, setCurrentProposalVotingCountRevealError, voteForCurrentProposalError, setProposalVotingOpenStatusError, setProposalBeingDiscussedStatusError, setProposalsSubmittingCloseError, submitProposalError]);

    useEffect(() => {
        if (
            loadSharesAndCustomersToBallotIsConfirmed ||
            setProposalsSubmittingCloseIsClosed ||
            setProposalVotingOpenStatusIsConfirmed ||
            lockContractIsConfirmed
        ) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            onRefetchStatus();
            // refetch minProposals
        }
    }, [loadSharesAndCustomersToBallotIsConfirmed, setProposalsSubmittingCloseIsClosed, setProposalVotingOpenStatusIsConfirmed, lockContractIsConfirmed]);


    useEffect(() => {
        if (voteForCurrentProposalIsConfirmed) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            // refetch list of voters of current proposal => compute hasVotedForThis proposal
        }
    }, [voteForCurrentProposalIsConfirmed]);


    useEffect(() => {
        if (submitProposalIsConfirmed) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            refetchMinProposals();
        }
    }, [submitProposalIsConfirmed]);

    useEffect(() => {
        if (setCurrentProposalVotingCountRevealIsConfirmed) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            // TODO REFETCH CURRENT PROPOSAL => RESULTS 
        }
    }, [setCurrentProposalVotingCountRevealIsConfirmed]);

    useEffect(() => {
        if (setCurrentProposalVotingCountRevealIsConfirmed) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            // TODO REFETCH CURRENT PROPOSAL DESC TO DISPLAY
        }
    }, [setProposalBeingDiscussedStatusIsConfirmed]);

    //     const getBalance = async (addressToConsult: string) => {
    //         return triggerGetBalance(globalCtx.erc20Address, addressToConsult);
    //     }
    //     if (globalCtx.erc20Address) {
    //         const response = getBalance(globalCtx.deployedManagerAddress);
    //         response
    //             .then((truc: any) => {
    //                 setOwnersBalance(Number(truc));


    const loadSharesAndCustomersToBallotHandler = () => {
        loadSharesAndCustomersToBallotWrite(connectedAccount, globalCtx.deployedManagerAddress);
    }

    const submittedProposalHandler = (description: string) => {
        submitProposalWrite(description, connectedAccount, globalCtx.deployedBallotAddress);
    }

    const closeSubmittingProposalsHandler = () => {
        setProposalsSubmittingClosedWrite(connectedAccount, globalCtx.deployedBallotAddress)
    }

    const openProposalForDiscussingOrEndGmHandler = () => {
        setProposalBeingDiscussedStatusWrite(connectedAccount, globalCtx.deployedBallotAddress)
    }

    const openProposalForVotingHandler = () => {
        setProposalVotingOpenStatusWrite(connectedAccount, globalCtx.deployedBallotAddress)
    }

    const votedHandler = (voteType: number) => {
        voteForCurrentProposalWrite(connectedAccount, globalCtx.deployedBallotAddress, voteType);
    }

    const closeVotingHandler = () => {
        setCurrentProposalVotingCountRevealWrite(connectedAccount, globalCtx.deployedBallotAddress);
    }

    const lockContractHandler = () => {
        lockContractWrite(connectedAccount, globalCtx.deployedBallotAddress);
    }


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
    //             })
    //     }
    // }

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
                </>
            </NonClosableModal>,
        );
    }


    return (
        <div>
            <h1>General meeting ! (Ballot)</h1>
            <StatusInstructions status={globalCtx.ballotStatus} role={globalCtx.role} />
            <DisplayInfos minProposals={minProposals} currentProposal={ } completeVotingResults={ } />
            <Actions
                userVoted={false}
                hasProposal={false}
                ballotHasVotes={false}
                onLoadSharesAndCustomersToBallot={loadSharesAndCustomersToBallotHandler}
                onSubmittedProposal={submittedProposalHandler}
                onCloseSubmittingProposals={closeSubmittingProposalsHandler}
                onOpenProposalForDiscussingOrEndGm={openProposalForDiscussingOrEndGmHandler}
                onOpenProposalForVoting={openProposalForVotingHandler}
                onVoted={votedHandler}
                onCloseVoting={closeVotingHandler}
                onLockContract={lockContractHandler}
            />
            {/* {modals} */}
        </div>
    );
}

export default Ballot;
