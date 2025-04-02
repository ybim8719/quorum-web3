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
import { OWNER_ROLE } from "../../../../models/roles";
import { useContext } from "react";
import { GlobalContext } from "../../../../context/globalContext";
import SubmitProposalInput from "../Forms/SubmitProposalInput";

interface IActions {
  userVoted: boolean;
  hasProposal: boolean;
  ballotHasVotes: boolean;
  onLoadSharesAndCustomersToBallot: () => void;
  onSubmittedProposal: (description: string) => void;
  onCloseSubmittingProposals: () => void;
  onOpenProposalForDiscussingOrEndGm: () => void;
  onOpenProposalForVoting: () => void;
  onVoted: (proposalId: number) => void;
  onCloseVoting: () => void;
  onLockContract: () => void;
}

const Actions = ({
  userVoted,
  hasProposal,
  ballotHasVotes,
  onLoadSharesAndCustomersToBallot,
  onSubmittedProposal,
  onCloseSubmittingProposals,
  onOpenProposalForDiscussingOrEndGm,
  onOpenProposalForVoting,
  onVoted,
  onCloseVoting,
  onLockContract
}: IActions) => {
  const globalCtx = useContext(GlobalContext);
  let actionToDisplay;
  if (
    globalCtx.ballotStatus === null ||
    Object.keys(BALLOT_STATUS_INSTRUCTIONS).includes(globalCtx.ballotStatus) === false
  ) {
    actionToDisplay = <p>Status not found</p>;
  } else {
    if (globalCtx.role === OWNER_ROLE) {
      switch (globalCtx.ballotStatus) {
        case WAITING_FOR_GM_DATA_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onLoadSharesAndCustomersToBallot} btnDescription="Transfer voters and open subMITTING PROPOSALS" />;
          break;
        case PROPOSALS_SUBMITTING_OPEN_KEY:
          if (hasProposal) {
            actionToDisplay = <SwitchToNextStepButton onValidate={onCloseSubmittingProposals} btnDescription="CLOSE SUBMITTING PROPOSALS" />;
          } else {
            actionToDisplay = <p>Wait for at least one proposal</p>
          }
          break;
        case PROPOSAL_SUBMITTING_CLOSED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForDiscussingOrEndGm} btnDescription="Open 1st proposal for discussing" />;
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
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForDiscussingOrEndGm} btnDescription="Handle Next Proposal (or end all)" />;
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
    <div className="section">
      <h3>
        <u>ACTIONS:</u> <i className="snes-jp-logo"></i>
      </h3 >
      {actionToDisplay}
    </div >
  );
}

export default Actions;
