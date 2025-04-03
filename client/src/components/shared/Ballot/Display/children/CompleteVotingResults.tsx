import { JSX } from "react";
import ProposalVotingResult from "./ProposalVotingResult";
import { ProposalCompleted } from "../../../../../models/ballot";

interface ICompleteVotingResults {
    completeVotingResults: ProposalCompleted[];
}

const CompleteVotingResults = ({ completeVotingResults }: ICompleteVotingResults) => {
    let content: JSX.Element[] = [];
    if (completeVotingResults.length > 0) {
        content = completeVotingResults.map((result) => {
            return <ProposalVotingResult currentProposal={result} />
        })
    }
    return (
        <div className="section">
            <h3>ALL FINAL RESULTS <i className="nes-jp-logo"></i>
            </h3>
            {content}
        </div>
    );
}

export default CompleteVotingResults;