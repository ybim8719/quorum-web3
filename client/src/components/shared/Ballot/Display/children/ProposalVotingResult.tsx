
interface IProposalVotingResult {
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

const ProposalVotingResult = ({ votingResult, proposalId, proposalDescription }: IProposalVotingResult) => {
    let tableBody;
    if (votingResult && votingResult.details.length > 0) {
        tableBody = votingResult.details.map((d, i) => {
            return (
                <tr key={`customer-${i}`}>
                    <td className="">{d.firstName} {d.lastName}</td>
                    <td className="">{d.customerAddress.slice(0, 15)}...</td>
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
            <i className="nes-ash"></i>
            <h3>Voting result for proposal {proposalId}</h3>
            <div>Description: {proposalDescription}</div>
            <div>
                Results:
                <ul>
                    <li>Approvals : {votingResult.approvals} /1000</li>
                    <li>Refusals : {votingResult.refusals} /1000</li>
                    <li>Blank : {votingResult.blank} /1000</li>
                    <li>Winner : {votingResult.winner} /1000</li>
                </ul>
            </div>

            <div>
                <u>Number of voters : ({votingResult.details.length})</u>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="">Name</th>
                        <th className="">Address</th>
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