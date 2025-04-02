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
import { BallotCountResults, CompleteBallotCountResults } from "../models/ballot.ts";


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
    const [votedOnCurrentProposal, setVotedOnCurrentProposal] = useState<string[]>([]);
    const [currentProposalWithResult, setCurrentProposalWithResult] = useState<{
        id: number;
        description: string;
        votingResult: BallotCountResults,
    } | null>(null);
    const [allProposalResults, setAllProposalResults] = useState<CompleteBallotCountResults[]>([]);

    // Read hooks
    const { useFetchedCompleteProposals, useFetchedMinProposals, useFetchedCurrentMinimalProposal, useFetchedVotersOfCurrentProposal, useFetchedCurrentProposalComplete } = useReadBallotQueries(globalCtx.deployedBallotAddress);
    const { data: fetchedMinProposalsData, refetch: refetchMinProposals } = useFetchedMinProposals;
    const { data: fetchedCompleteProposalsData, refetch: refetchCompleteProposals } = useFetchedCompleteProposals;
    const { data: fetchedCurrentMinimalProposalData, refetch: refetchCurrentMinimalProposalData } = useFetchedCurrentMinimalProposal;
    const { data: fetchedVotersOfCurrentProposalData, refetch: refetchVotersOfCurrentProposal } = useFetchedVotersOfCurrentProposal;
    const { data: fetchedCurrentProposalCompleteData, refetch: refetchCurrentProposalComplete } = useFetchedCurrentProposalComplete;

    console.log(fetchedCurrentMinimalProposalData, "fetchedCurrentMinimalProposalData");
    console.log(fetchedVotersOfCurrentProposalData, "fetchedVotersOfCurrentProposalData");
    console.log(fetchedCurrentProposalCompleteData, "fetchedCurrentProposalCompleteData");


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
        isConfirmed: setProposalsSubmittingCloseIsConfirmed,
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

    // WATCH ERROR FROM TX
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

    // WATCH TX LEADING TO REFETCH STATUS
    useEffect(() => {
        if (
            loadSharesAndCustomersToBallotIsConfirmed ||
            setProposalsSubmittingCloseIsConfirmed ||
            setProposalVotingOpenStatusIsConfirmed ||
            lockContractIsConfirmed
        ) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            onRefetchStatus();
        }
    }, [loadSharesAndCustomersToBallotIsConfirmed, setProposalsSubmittingCloseIsConfirmed, setProposalVotingOpenStatusIsConfirmed, lockContractIsConfirmed]);

    // WATCH TX LEADING TO REFETCH LIST OF VOTERS OF CURRENT PROPOSALS
    useEffect(() => {
        if (voteForCurrentProposalIsConfirmed) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            // refetch list of voters of current proposal => compute hasVotedForThis proposal
        }
    }, [voteForCurrentProposalIsConfirmed]);

    // WATCH TX LEADING TO REFETCH LIST OF PROPOSALS BEING CREATED
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

    useEffect(() => {
        if (fetchedMinProposalsData) {
            const proposals = (fetchedMinProposalsData as { description: string }[]).map((el) => {
                return el.description;
            })
            setMinProposals(proposals);
        }
    }, [fetchedMinProposalsData])


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

    let hasProposal = false;
    if (minProposals && minProposals.length > 0) {
        hasProposal = true;
    }

    let userVoted = false;
    if (votedOnCurrentProposal.length > 0) {
        if (votedOnCurrentProposal.includes(connectedAccount as string)) {
            userVoted = true;
        };
    }

    return (
        <div>
            <h1>General meeting ! (Ballot)</h1>
            <p>Welcome, dear {globalCtx.role} !</p>
            <StatusInstructions status={globalCtx.ballotStatus} role={globalCtx.role} />
            <DisplayInfos minProposals={minProposals} currentProposal={currentProposalWithResult} completeVotingResults={allProposalResults} />
            <Actions
                userVoted={userVoted}
                hasProposal={hasProposal}
                ballotHasVotes={votedOnCurrentProposal.length > 0}
                onLoadSharesAndCustomersToBallot={loadSharesAndCustomersToBallotHandler}
                onSubmittedProposal={submittedProposalHandler}
                onCloseSubmittingProposals={closeSubmittingProposalsHandler}
                onOpenProposalForDiscussingOrEndGm={openProposalForDiscussingOrEndGmHandler}
                onOpenProposalForVoting={openProposalForVotingHandler}
                onVoted={votedHandler}
                onCloseVoting={closeVotingHandler}
                onLockContract={lockContractHandler}
            />
            {modals}
        </div>
    );
}

export default Ballot;
