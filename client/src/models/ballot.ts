export const REGISTERING_VOTERS_KEY = "registeringVoters";
export const PROPOSAL_REGISTRATION_STARTED_KEY = "proposalsRegistrationStarted";
export const PROPOSAL_REGISTRATION_ENDED_KEY = "proposalsRegistrationEnded";
export const VOTING_SESSIONS_STARTED_KEY = "votingSessionStarted";
export const VOTING_SESSIONS_ENDED_KEY = "votingSessionEnded";
export const VOTES_TALLIED_KEY = "votesTallied";
export const OWNERS_CHOICE_KEY = "ownersChoice";

export const STATUS_RULES: Record<
  string,
  {
    statusId: number;
    title: string;
    description: string;
    ownerInstruction: string;
    voterInstruction: string;
  }
> = {
  [REGISTERING_VOTERS_KEY]: {
    statusId: 0,
    title: "Registering Voters",
    description: "Owner is registering voters addresses in a voting whitelist.",
    ownerInstruction: "Feel free to add new voters to the whitelist.",
    voterInstruction:
      "Owner is registering voters, proposal submission will be open soon.",
  },
  [PROPOSAL_REGISTRATION_STARTED_KEY]: {
    statusId: 1,
    title: "Proposals Registration Started",
    description:
      "Proposal registration status started. Registered voters are allowed to send their proposals.",
    ownerInstruction:
      "Voters are submiting proposals, set to next step when at least one proposal is registered.",
    voterInstruction: "Send your proposals to ballot",
  },
  [PROPOSAL_REGISTRATION_ENDED_KEY]: {
    statusId: 2,
    title: "Proposals Registration Ended",
    description:
      "Proposal submission status ended. No more proposals would be added",
    ownerInstruction: "Step to Voting session opening when you are ready",
    voterInstruction: "Voting session will start soon",
  },
  [VOTING_SESSIONS_STARTED_KEY]: {
    statusId: 3,
    title: "Voting Session Started",
    description: "Now, voters can vote for their prefered proposals",
    ownerInstruction: "Wait for voters to be done with votes",
    voterInstruction: "Please handle you vote (one vote per voter!)",
  },
  [VOTING_SESSIONS_ENDED_KEY]: {
    statusId: 4,
    title: "Voting Session Ended",
    description: "Voting session was closed, votes are now deactivated.",
    ownerInstruction: "Step over to Votes Tallied when you are ready.",
    voterInstruction: "Results will be published soon...",
  },
  [VOTES_TALLIED_KEY]: {
    statusId: 5,
    title: "Votes Tallied",
    description: "Starting votes tallying.",
    ownerInstruction: "Just click on pickwinner and celebrate !",
    voterInstruction: "Check the results.",
  },
  [OWNERS_CHOICE_KEY]: {
    statusId: 6,
    title: "OwnersChoice",
    description: "Tie vote ! another round of voting will be made by the owner",
    ownerInstruction: "Select the winner and achieve the ballot",
    voterInstruction: "Chec the results",
  },
};

export function getNextStatusIdToRequest(statusKey: keyof typeof STATUS_RULES) {
  if (
    Object.keys(STATUS_RULES).includes(statusKey) &&
    statusKey !== OWNERS_CHOICE_KEY
  ) {
    return STATUS_RULES[statusKey].statusId + 1;
  }
  return null;
}
