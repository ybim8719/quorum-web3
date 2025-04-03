import { BallotCountResults, votingResultKeys } from "../../../../../models/ballot";

interface IProposalVotingResult {
    currentProposal: {
        id: number;
        description: string;
        votingResult: BallotCountResults | null,
    } | null
}

const ProposalVotingResult = ({ currentProposal }: IProposalVotingResult) => {
    if (currentProposal === null || currentProposal?.votingResult === null) {
        return <p>NO RESULT ?</p>
    }
    let tableBody;
    if (currentProposal && currentProposal.votingResult?.details?.length > 0) {
        tableBody = currentProposal.votingResult.details.map((d, i) => {
            return (
                <tr key={`customer-${i}`}>
                    <td className="">{d.firstName} {d.lastName}</td>
                    <td className="">{d.lotOfficialNumber}</td>
                    <td className="">{d.shares}</td>
                    <td className="">{d.vote}</td>
                </tr>
            );
        });
    } else {
        tableBody = (
            <tr>
                <td colSpan={4}>No Result to display</td>
            </tr>
        );
    }

    return (
        <div className="section">
            <i class="nes-icon trophy is-large"></i>
            <h3>Voting result for proposal {currentProposal.id}</h3>
            <div><u>Description</u>: {currentProposal.description}</div>
            <div>
                Results:
                <ul>
                    <li>Approvals : {currentProposal.votingResult.approvals} /1000</li>
                    <li>Refusals : {currentProposal.votingResult.refusals} /1000</li>
                    <li>Blank : {currentProposal.votingResult.blank} /1000</li>
                    <li><u>Winner</u> : {votingResultKeys[currentProposal.votingResult.winner.toString()]} </li>
                </ul>
            </div>

            <div>
                <u>Number of voters : ({currentProposal.votingResult.details.length})</u>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="">Name</th>
                        <th className="">lotOfficialNumber</th>
                        <th className="">Shares</th>
                        <th className="">Vote</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </table>
        </div>
    );
}

export default ProposalVotingResult;