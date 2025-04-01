interface IProposalBeingVoted {
    proposal: {
        id: number;
        description: string
    };
}

const ProposalBeingVoted = ({ proposal }: IProposalBeingVoted) => {

    return (
        <div>
            <h2> PROPOSITION N° {proposal.id}</h2>
            <h3>{proposal.description}</h3>
        </div>
    );
}

export default ProposalBeingVoted;
