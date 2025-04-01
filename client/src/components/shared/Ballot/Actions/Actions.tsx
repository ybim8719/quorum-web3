import classes from "./Actions.module.css";
import {
  WAITING_FOR_GM_DATA_KEY,
  PROPOSALS_SUBMITTING_OPEN_KEY,
  PROPOSAL_SUBMITTING_CLOSED_KEY,
  PROPOSAL_BEING_DISCUSSED_KEY,
  PROPOSAL_VOTING_OPEN_KEY,
  PROPOSAL_VOTING_COUNT_REVEALED_KEY,
  MEETING_ENDED_KEY,
  CONTRACT_LOCKED_KEY,
  BALLOT_STATUS_INSTRUCTIONS,
} from "../../../../models/ballot";

import SwitchToNextStepButton from "../Forms/SwitchToNextStepButton";
import VoteInput from "../Forms/VoteInput";
import { ADMIN_ROLE } from "../../../../models/roles";
import { useContext } from "react";
import { GlobalContext } from "../../../../context/globalContext";
import SubmitProposalInput from "../Forms/SubmitProposalInput";

interface IActions {
  userVoted: boolean;
  hasProposal: boolean;
  ballotHasVotes: boolean;
  onOpenSubmittingProposals: () => void;
  onSubmittedProposal: (description: string) => void;
  onCloseSubmittingProposals: () => void;
  onOpenProposalForDiscussing: () => void;
  onOpenProposalForVoting: () => void;
  onVoted: (proposalId: number) => void;
  onCloseVoting: () => void;
  onNextProposal: () => void;
  onLockContract: () => void;
}

const Actions = ({
  userVoted,
  hasProposal,
  ballotHasVotes,
  onOpenSubmittingProposals,
  onSubmittedProposal,
  onCloseSubmittingProposals,
  onOpenProposalForDiscussing,
  onOpenProposalForVoting,
  onVoted,
  onCloseVoting,
  onNextProposal,
  onLockContract
}: IActions) => {
  const globalCtx = useContext(GlobalContext);
  let actionToDisplay;

  // ballot closed, no actions

  if (
    globalCtx.ballotStatus === null ||
    Object.keys(BALLOT_STATUS_INSTRUCTIONS).includes(globalCtx.ballotStatus) === false
  ) {
    actionToDisplay = <p>Status not found</p>;
  } else {
    if (globalCtx.role === ADMIN_ROLE) {
      switch (globalCtx.ballotStatus) {
        case WAITING_FOR_GM_DATA_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenSubmittingProposals} btnDescription="OPEN SUBMITTING PROPOSALS" />;
          break;
        case PROPOSALS_SUBMITTING_OPEN_KEY:
          if (hasProposal) {
            actionToDisplay = <SwitchToNextStepButton onValidate={onCloseSubmittingProposals} btnDescription="CLOSE SUBMITTING PROPOSALS" />;
          } else {
            actionToDisplay = <p>Wait for at least one proposal</p>
          }
          break;
        case PROPOSAL_SUBMITTING_CLOSED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForDiscussing} btnDescription="Open 1st proposal for discussing" />;
          break;
        case PROPOSAL_BEING_DISCUSSED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForVoting} btnDescription="Open Voting" />;
          break;
        case PROPOSAL_VOTING_OPEN_KEY:
          if (ballotHasVotes) {
            actionToDisplay = <SwitchToNextStepButton onValidate={onCloseVoting} btnDescription="Close ballot for current proposal" />;
          } else {
            actionToDisplay = <p>Wait for at least one Vote</p>
          }
          break;
        case PROPOSAL_VOTING_COUNT_REVEALED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onNextProposal} btnDescription="Handle Next Proposal" />;
          break;
        case MEETING_ENDED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onLockContract} btnDescription="Confirm Locking of contract" />;
          break;
        case CONTRACT_LOCKED_KEY:
          actionToDisplay = null;
          break;
      }
    } else {
      actionToDisplay = <p>ATTENDRE...</p>;
      switch (globalCtx.ballotStatus) {
        case PROPOSALS_SUBMITTING_OPEN_KEY:
          actionToDisplay = <SubmitProposalInput onValidate={onSubmittedProposal} />;
          break;
        case PROPOSAL_VOTING_OPEN_KEY:
          if (userVoted === false) {
            actionToDisplay = <VoteInput onValidate={onVoted} />;
          } else {
            actionToDisplay = <p>You already voted. wait for count reveal</p>;
          }
      }
    }
  }

  return (
    <div className={classes.Actions}>
      <h3>
        <u>ACTIONS:</u> <i className="snes-jp-logo"></i>
      </h3 >
      {actionToDisplay}
    </div >
  );
}

export default Actions;
