interface IProposalBeingVoted {
    id: number;
    description: string
}

const ProposalBeingVoted = ({ id, description }: IProposalBeingVoted) => {
    return (
        <div className="section">
            <h2> PROPOSITION N° {id}</h2>
            <h3>{description}</h3>
        </div>
    );
}

export default ProposalBeingVoted;
