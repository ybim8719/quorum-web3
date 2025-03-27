export const BALLOT_READY_KEY = "BallotReady";
export const ATTENDEES_SIGNING_KEY = "AttendeesSigning";
export const PROPOSAL_BEING_SUBMITTED_KEY = "ProposalBeingSubmitted";
export const ATTENDEES_SIGNING_COUNT_REVEALED_KEY = "AttendeesSigningCountRevealed";
export const PROPOSAL_VOTING_OPEN_KEY = "ProposalVotingOpen";
export const PROPOSAL_VOTING_CLOSED_KEY = "ProposalVotingClosed";
export const PROPOSAL_VOTING_COUNT_REVEALED_KEY = "ProposalVotingCountRevealed";
export const MEETING_ENDED_KEY = "MeetingEnded";
export const CONTRACT_LOCKED_KEY = "ContractLocked";

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
  [BALLOT_READY_KEY]: {
    statusId: 0,
    title: "Ballot Ready",
    description: "General meeting is now set !",
    ownerInstruction: "Feel free to switch to attendees signing period when you are ready",
    customerInstruction:
      "Attendees Signing period will open soon.",
  },
  [ATTENDEES_SIGNING_KEY]: {
    statusId: 1,
    title: "Attendees Signing",
    description:
      "Owners which are attending the meeting, must confirm their presence",
    ownerInstruction:
      "Half of total customers must confirm before closing this period.",
    customerInstruction: "Please confirm your presence in order to vote by clicking here",
  },
  [ATTENDEES_SIGNING_COUNT_REVEALED_KEY]: {
    statusId: 2,
    title: "Attendees Signing Count Revealed",
    description:
      "Attendees list is now finalized in this chart below ",
    ownerInstruction:
      "Switch to the period of Proposal Voting Presentation when your attendees are all ok. ",
    customerInstruction: "Ensure you've signed in the Attendees list ",
  },
  [PROPOSAL_BEING_SUBMITTED_KEY]: {
    statusId: 3,
    title: "Proposal Being Submitted",
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
  [PROPOSAL_VOTING_CLOSED_KEY]: {
    statusId: 5,
    title: "Proposal Voting Closed",
    description: "Current Ballot is closed, no more votes are admitted",
    ownerInstruction: "Handle counting reveal when ready",
    customerInstruction: "Please wait for the results",
  },
  [PROPOSAL_VOTING_COUNT_REVEALED_KEY]: {
    statusId: 6,
    title: "Prposal Voting Count Revealed",
    description: "Current Ballot results are now available.",
    ownerInstruction: "Step over to Next proposal submission when ready",
    customerInstruction: "",
  },
  [MEETING_ENDED_KEY]: {
    statusId: 7,
    title: "Meeting Ended",
    description: "Meeting is now achieved !",
    ownerInstruction: "Lock the Contract when you are ready (this action is XXXXXX) ",
    customerInstruction: "Please consult finalized list of ballots results below:",
  },
  [CONTRACT_LOCKED_KEY]: {
    statusId: 8,
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
