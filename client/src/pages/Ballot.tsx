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
    useLockContract,
} from "../hooks/useWriteBallotActions";
import { useReadBallotQueries } from "../hooks/useReadBallotQueries.ts";
import LoadingIndicator from "../components/UI/LoadingIndicator.tsx";
import ErrorBlock from "../components/UI/ErrorBlock.tsx";
import StatusInstructions from "../components/shared/Ballot/StatusInstructions.tsx";
import Actions from "../components/shared/Ballot/Actions/Actions.tsx";
import DisplayInfos from "../components/shared/Ballot/Display/DisplayInfos.tsx";
import { useloadSharesAndCustomersToBallot } from "../hooks/useWriteManagerActions.ts";
import { ProposalCompleted, VoterInfo } from "../models/ballot.ts";
import { FetchedCurrentProposalCompleteRawData, FetchedCurrentMinimalProposalRawData } from "../models/apiReturnType.ts";


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
    const [currentProposalWithResult, setCurrentProposalWithResult] = useState<ProposalCompleted>(null);
    const [allProposalResults, setAllProposalResults] = useState<ProposalCompleted[]>([]);

    // Read hooks
    const { useFetchedCompleteProposals, useFetchedMinProposals, useFetchedCurrentMinimalProposal, useFetchedVotersOfCurrentProposal, useFetchedCurrentProposalComplete } = useReadBallotQueries(globalCtx.deployedBallotAddress);
    const { data: fetchedMinProposalsData, refetch: refetchMinProposals } = useFetchedMinProposals;
    const { data: fetchedCompleteProposalsData, refetch: refetchCompleteProposals } = useFetchedCompleteProposals;
    const { data: fetchedCurrentMinimalProposalData, refetch: refetchCurrentMinimalProposalData } = useFetchedCurrentMinimalProposal;
    const { data: fetchedVotersOfCurrentProposalData, refetch: refetchVotersOfCurrentProposal } = useFetchedVotersOfCurrentProposal;
    const { data: fetchedCurrentProposalCompleteData, refetch: refetchCurrentProposalComplete } = useFetchedCurrentProposalComplete;

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
            lockContractIsConfirmed
        ) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            onRefetchStatus();
        }
    }, [loadSharesAndCustomersToBallotIsConfirmed, setProposalsSubmittingCloseIsConfirmed, lockContractIsConfirmed]);

    // WATCH TX LEADING TO REFETCH STATUS
    useEffect(() => {
        if (
            setProposalVotingOpenStatusIsConfirmed
        ) {
            console.log(setProposalVotingOpenStatusIsConfirmed, "setProposalVotingOpenStatusIsConfirmed")

            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            refetchVotersOfCurrentProposal();
            onRefetchStatus();
        }
    }, [setProposalVotingOpenStatusIsConfirmed]);

    // WATCH TX LEADING TO REFETCH LIST OF VOTERS OF CURRENT PROPOSALS
    useEffect(() => {
        if (voteForCurrentProposalIsConfirmed) {
            console.log(voteForCurrentProposalIsConfirmed, "voteForCurrentProposalIsConfirmed")
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            refetchVotersOfCurrentProposal();
            refetchCurrentProposalComplete();
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
            console.log(setCurrentProposalVotingCountRevealIsConfirmed, "setCurrentProposalVotingCountRevealIsConfirmed")
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            onRefetchStatus();
            refetchCurrentProposalComplete();
        }
    }, [setCurrentProposalVotingCountRevealIsConfirmed]);

    useEffect(() => {
        if (setProposalBeingDiscussedStatusIsConfirmed) {
            console.log(setProposalBeingDiscussedStatusIsConfirmed, "setProposalBeingDiscussedStatusIsConfirmed")
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            onRefetchStatus();
            refetchCurrentMinimalProposalData();
            refetchVotersOfCurrentProposal();
            // if current proposals being voted is the last, then show final recap of all results.
            if (minProposals.length > 0 && currentProposalWithResult && (minProposals.length === currentProposalWithResult.id)) {
                refetchCompleteProposals();
            }
        }
    }, [setProposalBeingDiscussedStatusIsConfirmed]);

    console.log(votedOnCurrentProposal, "votedOnCurrentProposal");

    useEffect(() => {
        if (fetchedMinProposalsData) {
            const proposals = (fetchedMinProposalsData as { description: string }[]).map((el) => {
                return el.description;
            })
            setMinProposals(proposals);
        }
    }, [fetchedMinProposalsData])

    useEffect(() => {
        const data = fetchedCurrentMinimalProposalData as FetchedCurrentMinimalProposalRawData;
        if (data) {
            // backend always send an objet, if current proposal = 0, then NO proposal is currently handled 
            if (Number(data.id) > 0) {
                setCurrentProposalWithResult({
                    id: Number(data.id),
                    description: data.description,
                    votingResult: null
                })
            }
        }
    }, [fetchedCurrentMinimalProposalData])

    useEffect(() => {
        const data = fetchedVotersOfCurrentProposalData as string[];
        if (data) {
            setVotedOnCurrentProposal(data);
        }
    }, [fetchedVotersOfCurrentProposalData])

    useEffect(() => {
        const data = fetchedCurrentProposalCompleteData as FetchedCurrentProposalCompleteRawData;
        if (data) {
            // backend always send an objet, if current proposal = 0, then NO proposal is currently handled 
            if (Number(data.id) > 0) {
                const votingResult = formatResults(data);
                setCurrentProposalWithResult({
                    id: Number(data.id),
                    description: data.description,
                    votingResult: votingResult
                })
            }
        }
    }, [fetchedCurrentProposalCompleteData])

    useEffect(() => {
        const data = fetchedCompleteProposalsData as FetchedCurrentProposalCompleteRawData[];
        if (data && data.length > 0) {
            const proposals: ProposalCompleted[] = [];
            data.forEach((completeProposal) => {
                if (Number(completeProposal.id) > 0) {
                    const votingResult = formatResults(completeProposal);
                    const formatedProposal = {
                        id: Number(completeProposal.id),
                        description: completeProposal.description,
                        votingResult: votingResult
                    }
                    proposals.push(formatedProposal);
                }
            });
            setAllProposalResults(proposals);
        }
    }, [fetchedCompleteProposalsData])

    const formatResults = (data: FetchedCurrentProposalCompleteRawData) => {
        const details: VoterInfo[] = [];
        if (data.approvals.length > 0) {
            data.approvals.forEach((el) => {
                const voterInfo = {
                    firstName: el.firstName,
                    lastName: el.lastName,
                    lotOfficialNumber: el.lotOfficialNumber,
                    shares: Number(el.shares),
                    vote: "approved",
                }
                details.push(voterInfo)
            })
        }

        if (data.refusals.length > 0) {
            data.refusals.forEach((el) => {
                const voterInfo = {
                    firstName: el.firstName,
                    lastName: el.lastName,
                    lotOfficialNumber: el.lotOfficialNumber,
                    shares: Number(el.shares),
                    vote: "refused",
                }
                details.push(voterInfo)
            })
        }

        if (data.blankVotes.length > 0) {
            data.blankVotes.forEach((el) => {
                const voterInfo = {
                    firstName: el.firstName,
                    lastName: el.lastName,
                    lotOfficialNumber: el.lotOfficialNumber,
                    shares: Number(el.shares),
                    vote: "blank vote",
                }
                details.push(voterInfo)
            })
        }

        const votingResult = {
            approvals: Number(data.approvalShares),
            refusals: Number(data.refusalShares),
            blank: Number(data.blankVotesShares),
            winner: data.votingResult.toString(),
            details: details
        }

        return votingResult;
    }

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

    if (isZeroAddress(globalCtx.erc20Address) || globalCtx.erc20Address === undefined || globalCtx.erc20Address === "") {
        return <p>NO ERC20 Created, go to HOME</p>;
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
                votesRegistered={votedOnCurrentProposal.length}
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
