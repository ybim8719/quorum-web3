import { useContext } from "react";
import { GlobalContext } from "../../../../context/globalContext";
import {
    PROPOSALS_SUBMITTING_OPEN_KEY,
    PROPOSAL_SUBMITTING_CLOSED_KEY,
    PROPOSAL_BEING_DISCUSSED_KEY,
    PROPOSAL_VOTING_OPEN_KEY,
    PROPOSAL_VOTING_COUNT_REVEALED_KEY,
    MEETING_ENDED_KEY,
    CONTRACT_LOCKED_KEY,
    BALLOT_STATUS_INSTRUCTIONS,
} from "../../../../models/ballot";

import ProposalsList from "./children/ProposalList";
import ProposalBeingVoted from "./children/ProposalBeingVoted";
import ProposalVotingResult from "./children/ProposalVotingResult";
import CompleteVotingResults from "./children/CompleteVotingResults";


interface VotingResult {
    approvals: number;
    refusals: number;
    blank: number;
    winner: string;
    details: {
        customerAddress: string;
        firstName: string;
        lastName: string;
        lotOfficialNumber: number;
        shares: number;
        vote: string;
    }[]
};

interface CompleteVotingResults {
    votingResult: {
        approvals: number;
        refusals: number;
        blank: number;
        winner: string;
        details: {
            customerAddress: string;
            firstName: string;
            lastName: string;
            lotOfficialNumber: number;
            shares: number;
            vote: string;
        }[]
    };
    proposalId: number;
    proposalDescription: string;
}

interface IActions {
    proposalsList: string[];
    proposalBeingVoted: {
        id: number;
        description: string
    };
    currentVotingResult: VotingResult;
    currentProposalId: number;
    currentProposalDescription: string;
    completeVotingResults: CompleteVotingResults[];
}


const Actions = ({
    proposalsList,
    proposalBeingVoted,
    currentVotingResult,
    currentProposalId,
    currentProposalDescription,
    completeVotingResults
}: IActions) => {
    const globalCtx = useContext(GlobalContext);
    let display;

    if (
        globalCtx.ballotStatus !== null &&
        Object.keys(BALLOT_STATUS_INSTRUCTIONS).includes(globalCtx.ballotStatus) === false
    ) {
        switch (globalCtx.ballotStatus) {
            case PROPOSALS_SUBMITTING_OPEN_KEY:
                display = <ProposalsList proposalsList={proposalsList} />;
                break;
            case PROPOSAL_SUBMITTING_CLOSED_KEY:
                display = <ProposalsList proposalsList={proposalsList} />;
                break;
            case PROPOSAL_BEING_DISCUSSED_KEY:
                display = <ProposalBeingVoted proposal={proposalBeingVoted} />
                break;
            case PROPOSAL_VOTING_OPEN_KEY:
                display = <ProposalBeingVoted proposal={proposalBeingVoted} />
                break;
            case PROPOSAL_VOTING_COUNT_REVEALED_KEY:
                display = <ProposalVotingResult votingResult={currentVotingResult} proposalId={currentProposalId} proposalDescription={currentProposalDescription} />;
                break;
            case MEETING_ENDED_KEY:
                display = <CompleteVotingResults completeVotingResults={completeVotingResults} />;
                break;
            case CONTRACT_LOCKED_KEY:
                display = <CompleteVotingResults completeVotingResults={completeVotingResults} />;
                break;
        }
    }


    return (
        <div>
            {display}
        </div >
    );
}

export default Actions;
