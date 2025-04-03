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
  votesRegistered: number;
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
  votesRegistered,
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
          actionToDisplay = <SwitchToNextStepButton onValidate={onLoadSharesAndCustomersToBallot} instructions="Transfer voters and open proposal Submission" />;
          break;
        case PROPOSALS_SUBMITTING_OPEN_KEY:
          if (hasProposal) {
            actionToDisplay = <SwitchToNextStepButton onValidate={onCloseSubmittingProposals} instructions="CLOSE PROPOSALS SUBMISSION" />;
          } else {
            actionToDisplay = <p>Wait for at least one proposal</p>
          }
          break;
        case PROPOSAL_SUBMITTING_CLOSED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForDiscussingOrEndGm} instructions="Open 1st proposal for discussing" />;
          break;
        case PROPOSAL_BEING_DISCUSSED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForVoting} instructions="Open Voting when tals are achieved" />;
          break;
        case PROPOSAL_VOTING_OPEN_KEY:
          if (votesRegistered > 0) {
            actionToDisplay = <>
              <p>{votesRegistered} owners have voted !</p>
              <SwitchToNextStepButton onValidate={onCloseVoting} instructions="Close ballot for current proposal" />
            </>;
          } else {
            actionToDisplay = <p>Wait for at least one Vote</p>
          }
          break;
        case PROPOSAL_VOTING_COUNT_REVEALED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onOpenProposalForDiscussingOrEndGm} instructions="Handle Next Proposal (or end all)" />;
          break;
        case MEETING_ENDED_KEY:
          actionToDisplay = <SwitchToNextStepButton onValidate={onLockContract} instructions="Confirm Locking of contract" />;
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
            actionToDisplay = <p>You already voted. wait for count reveal, {votesRegistered} owners have voted !</p>;
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
