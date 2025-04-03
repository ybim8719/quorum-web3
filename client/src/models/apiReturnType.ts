export type FetchedCurrentMinimalProposalRawData = {
    id: string,
    description: string
}

type VoterInfoView = {
    firstName: string,
    lastName: string,
    shares: string,
    lotOfficialNumber: string
}

export type FetchedCurrentProposalCompleteRawData = {
    id: string
    description: string;
    approvalShares: string;
    approvals: VoterInfoView[]
    blankVotesShares: string;
    blankVotes: VoterInfoView[]
    refusalShares: string
    refusals: VoterInfoView[]
    votingResult: number
}
