
interface IProposalsList {
    proposalsList: string[];
}

const ProposalsList = ({ proposalsList }: IProposalsList) => {
    if (proposalsList.length === 0) {
        return <p>No Proposals added yet</p>
    }

    return (
        <div className="section">
            <h2>Proposals registered</h2>
            <ul>
                {proposalsList.map((el) => {
                    return <li>{el}</li>
                })}
            </ul>
        </div >
    );
}

export default ProposalsList;
