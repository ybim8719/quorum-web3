
interface IProposalsList {
    proposalsList: string[] | null;
}

const ProposalsList = ({ proposalsList }: IProposalsList) => {
    if (proposalsList === null) {
        return <p>No proposals registered yet</p>
    }
    if (proposalsList.length === 0) {
        return <p>No Proposals registered yet</p>
    }

    return (
        <div className="section">
            <h2><u>Proposals registered</u></h2>
            <ul>
                {proposalsList.map((el, id) => {
                    return <li key={id}>{id + 1}) {el}</li>
                })}
            </ul>
        </div >
    );
}

export default ProposalsList;
