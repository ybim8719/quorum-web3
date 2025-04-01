import { JSX } from "react";
import ProposalVotingResult from "./ProposalVotingResult";

interface ProposalVotingResult {
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


interface ICompleteVotingResults {
    completeVotingResults: ProposalVotingResult[];
}

const CompleteVotingResults = ({ completeVotingResults }: ICompleteVotingResults) => {
    let content: JSX.Element[] = [];
    if (completeVotingResults.length > 0) {
        content = completeVotingResults.map((result) => {
            return <ProposalVotingResult votingResult={result.votingResult} proposalId={result.proposalId} proposalDescription={result.proposalDescription} />
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