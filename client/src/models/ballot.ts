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


// struct MinVoter {
//     string firstName;
//     string lastName;
//     uint256 shares;
//     string lotOfficialNumber;
// }

// struct ProposalView {
//     uint256 id;
//     string description;
//     VotingResult votingResult;
//   MinVoter[] approvals;
//     uint256 approvalShares;
//   MinVoter[] refusals;
//     uint256 refusalShares;
//   MinVoter[] blankVotes;
//     uint256 blankVotesShares;
// }

export const STATUS_INSTRUCTIONS: Record<
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
    title: "WaitingForGmData",
    description: "General meeting is now set !",
    ownerInstruction: "Feel free to open proposals submitting period",
    customerInstruction:
      "proposals submitting will open soon.",
  },
  [PROPOSALS_SUBMITTING_OPEN_KEY]: {
    statusId: 1,
    title: "ProposalsSubmittingOpen",
    description:
      "Voters can send their proposal for vote",
    ownerInstruction:
      "Half of total customers must confirm before closing this period.",
    customerInstruction: "Please send ypur proposal",
  },
  [PROPOSAL_SUBMITTING_CLOSED_KEY]: {
    statusId: 2,
    title: "ProposalsSubmittingClosed",
    description:
      "Proposals list is now finalized in this chart below ",
    ownerInstruction:
      "Switch to the period of Proposal Voting Discussion when your attendees are all ok. ",
    customerInstruction: "Wait ",
  },
  [PROPOSAL_BEING_DISCUSSED_KEY]: {
    statusId: 3,
    title: "Proposal Being discussed",
    description:
      "Current proposal is now being submitted and discussed.",
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

export function getNextStatusIdToRequest(statusKey: keyof typeof STATUS_INSTRUCTIONS) {
  if (
    Object.keys(STATUS_INSTRUCTIONS).includes(statusKey) &&
    statusKey !== CONTRACT_LOCKED_KEY
  ) {
    return STATUS_INSTRUCTIONS[statusKey].statusId + 1;
  }
  return null;
}
