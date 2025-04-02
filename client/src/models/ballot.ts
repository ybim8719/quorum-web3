export const WAITING_FOR_GM_DATA_KEY = "WaitingForGmData";
export const PROPOSALS_SUBMITTING_OPEN_KEY = "ProposalsSubmittingOpen";
export const PROPOSAL_SUBMITTING_CLOSED_KEY = "ProposalsSubmittingClosed";
export const PROPOSAL_BEING_DISCUSSED_KEY = "ProposalBeingDiscussed";
export const PROPOSAL_VOTING_OPEN_KEY = "ProposalVotingOpen";
export const PROPOSAL_VOTING_COUNT_REVEALED_KEY = "ProposalVotingCountRevealed";
export const MEETING_ENDED_KEY = "MeetingEnded";
export const CONTRACT_LOCKED_KEY = "ContractLocked";

export enum VotingResult {
  Pending,
  Approved,
  Refused,
  Draw
}


export type BallotCountResults = {
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
}

export type CompleteBallotCountResults = {
  votingResult: BallotCountResults;
  proposalId: number;
  proposalDescription: string;
}

export const BALLOT_STATUS_INSTRUCTIONS: Record<
  string,
  {
    statusId: number;
    title: string;
    description: string;
    ownerInstruction: string;
    customerInstruction: string;
  }
> = {
  [WAITING_FOR_GM_DATA_KEY]: {
    statusId: 0,
    title: "General Meeting initialized",
    description: "The evnt will soon be launched",
    ownerInstruction: "Feel free to open proposals submission period for voters",
    customerInstruction:
      "Date will provided soon",
  },
  [PROPOSALS_SUBMITTING_OPEN_KEY]: {
    statusId: 1,
    title: "Proposals Submission Open",
    description:
      "Voters can send their proposal for vote",
    ownerInstruction:
      "At least, one proposal must be submitted before closing the registration period.",
    customerInstruction: "Please send your proposal for ballot at the GM",
  },
  [PROPOSAL_SUBMITTING_CLOSED_KEY]: {
    statusId: 2,
    title: "Proposals Submission is Closed",
    description:
      "Proposals list is now finalized in this chart below:",
    ownerInstruction:
      "Switch to the period of Proposal Voting Discussion when your attendees are all ok. ",
    customerInstruction: "Presentation and votes of the proposals will be delivered soon...",
  },
  [PROPOSAL_BEING_DISCUSSED_KEY]: {
    statusId: 3,
    title: "A Proposal is currently discussed",
    description:
      "Please debate, attendees",
    ownerInstruction:
      "Switch to ballot opening when talks are done.",
    customerInstruction: "Ballot will open when talks are done.",
  },
  [PROPOSAL_VOTING_OPEN_KEY]: {
    statusId: 4,
    title: "Proposal Voting Open",
    description: "Ballot for current proposition is now open",
    ownerInstruction: "Close this ballot when at least half of attendees have voted",
    customerInstruction: "Select your vote:",
  },
  [PROPOSAL_VOTING_COUNT_REVEALED_KEY]: {
    statusId: 5,
    title: "Prposal Voting Count Revealed",
    description: "Current Ballot results are now available.",
    ownerInstruction: "Step over to Next proposal submission when ready",
    customerInstruction: "",
  },
  [MEETING_ENDED_KEY]: {
    statusId: 6,
    title: "Meeting Ended",
    description: "Meeting is now achieved !",
    ownerInstruction: "Lock the Contract when you are ready (this action is XXXXXX) ",
    customerInstruction: "Please consult finalized list of ballots results below:",
  },
  [CONTRACT_LOCKED_KEY]: {
    statusId: 7,
    title: "Contract Locked",
    description: "Meeting is now finalized.",
    ownerInstruction: "No action is now possible, modification of proposals and votes is definitively impossible",
    customerInstruction: "Please consult finalized list of ballots results below:",
  },
};
