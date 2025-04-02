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
    BallotCountResults,
    CompleteBallotCountResults,
} from "../../../../models/ballot";

import ProposalsList from "./children/ProposalList";
import ProposalBeingVoted from "./children/ProposalBeingVoted";
import ProposalVotingResult from "./children/ProposalVotingResult";
import CompleteVotingResults from "./children/CompleteVotingResults";


interface IActions {
    minProposals: string[] | null;
    currentProposal: {
        id: number;
        description: string;
        votingResult: BallotCountResults,
    } | null
    completeVotingResults: CompleteBallotCountResults[];
}

const DisplayInfos = ({
    minProposals,
    currentProposal,
    completeVotingResults
}: IActions) => {
    const globalCtx = useContext(GlobalContext);
    let display;

    if (
        globalCtx.ballotStatus !== null &&
        Object.keys(BALLOT_STATUS_INSTRUCTIONS).includes(globalCtx.ballotStatus)
    ) {
        switch (globalCtx.ballotStatus) {
            case PROPOSALS_SUBMITTING_OPEN_KEY:
                display = <ProposalsList proposalsList={minProposals} />;
                break;
            case PROPOSAL_SUBMITTING_CLOSED_KEY:
                display = <ProposalsList proposalsList={minProposals} />;
                break;
            case PROPOSAL_BEING_DISCUSSED_KEY:
                if (currentProposal) {
                    display = <ProposalBeingVoted id={currentProposal.id} description={currentProposal.description} />
                }
                break;
            case PROPOSAL_VOTING_OPEN_KEY:
                if (currentProposal) {
                    display = <ProposalBeingVoted id={currentProposal.id} description={currentProposal.description} />
                }
                break;
            case PROPOSAL_VOTING_COUNT_REVEALED_KEY:
                if (currentProposal) {
                    display = <ProposalVotingResult id={currentProposal.id} description={currentProposal.description} votingResult={currentProposal.votingResult} />;
                }
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

export default DisplayInfos;
