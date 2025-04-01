
interface IProposalsList {
    proposalsList: string[];
}

const ProposalsList = ({ proposalsList }: IProposalsList) => {
    if (proposalsList.length === 0) {
        return <p>No Proposals added yet</p>
    }

    return (
        <div>
            <ul>
                {proposalsList.map((el) => {
                    return <li>{el}</li>
                })}
            </ul>
        </div >
    );
}

export default ProposalsList;
