import { JSX } from "react";
import ProposalVotingResult from "./ProposalVotingResult";
import { CompleteBallotCountResults } from "../../../../../models/ballot";

interface ICompleteVotingResults {
    completeVotingResults: CompleteBallotCountResults[];
}

const CompleteVotingResults = ({ completeVotingResults }: ICompleteVotingResults) => {
    let content: JSX.Element[] = [];
    if (completeVotingResults.length > 0) {
        content = completeVotingResults.map((result) => {
            return <ProposalVotingResult votingResult={result.votingResult} id={result.proposalId} description={result.proposalDescription} />
        })
    }
    return (
        <div className="section">
            <i className="nes-ash"></i>
            <h3>ALL FINAL RESULTS</h3>
            {content}
        </div>
    );
}

export default CompleteVotingResults;