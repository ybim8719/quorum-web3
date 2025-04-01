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
  STATUS_INSTRUCTIONS,
} from "../../../models/ballot";

import SwitchToNextStepButton from "./Forms/SwitchToNextStepButton";
import VoteInput from "./Forms/VoteInput";
import { ADMIN_ROLE } from "../../../models/roles";

interface IActions {
  status: string | null;
  role: string;
  votingEnded: boolean;
  hasVoters: boolean;
  userVoted: boolean;
  ballotHasOneVoteOrMore: boolean;
  onRegisteredVoter: (address: string) => void;
  onVoted: (proposalId: number) => void;
  onSubmittedProposal: (description: string) => void;
  onSwitchToNextStep: (requestedStatusId: number) => void;
  onPickWinner: () => void;
  onSelectFinalWinner: (proposalId: number) => void;
}

const Actions = ({
  status,
  role,
  votingEnded,
  hasVoters,
  userVoted,
  ballotHasOneVoteOrMore,
  onRegisteredVoter,
  onSwitchToNextStep,
  onPickWinner,
  onSelectFinalWinner,
  onVoted,
  onSubmittedProposal,
}: IActions) => {
  let action1;
  let action2;

  // ballot closed, no actions
  if (status === CONTRACT_LOCKED_KEY) {
    action1 = <p>FINITO</p>;
  } else {
    if (
      status === null ||
      Object.keys(STATUS_INSTRUCTIONS).includes(status) === false
    ) {
      // status not found / No actions
      action1 = <p>GNé ?</p>;
    } else {
      if (role === ADMIN_ROLE) {
        switch (status) {
          case WAITING_FOR_GM_DATA_KEY:
            action1 = <RegisterVoterInput onValidate={onRegisteredVoter} />;
            if (hasVoters) {
              action2 = <SwitchToNextStepButton onValidate={toNextStep} />;
            }
            break;
          case PROPOSALS_SUBMITTING_OPEN_KEY:
            if (proposals.length > 0) {
              action1 = <p>{END_PROPOSAL_SUBMITTING_TEXT}</p>;
              action2 = <SwitchToNextStepButton onValidate={toNextStep} />;
            } else {
              action1 = <p>{PROPOSAL_NEEDED_TEXT}</p>;
            }
            break;
          case PROPOSAL_SUBMITTING_CLOSED_KEY:
            if (proposals.length > 0) {
              action1 = <p>{OPEN_VOTING_STATUS_TEXT}</p>;
              action2 = <SwitchToNextStepButton onValidate={toNextStep} />;
            }
            break;
          case PROPOSAL_BEING_DISCUSSED_KEY:
            if (ballotHasOneVoteOrMore) {
              action1 = <p>ballotHasOneVoteOrMore</p>;
              action2 = <SwitchToNextStepButton onValidate={toNextStep} />;
            } else {
              action1 = <p>{WAITING_FOR_VOTES}</p>;
            }
            break;
          case PROPOSAL_VOTING_OPEN_KEY:
            action1 = <p>{VOTE_TALLIED_TEXT}</p>;
            action2 = <SwitchToNextStepButton onValidate={toNextStep} />;
            break;
          case PROPOSAL_VOTING_COUNT_REVEALED_KEY:
            action1 = <PickWinnerButton onValidate={onPickWinner} />;
            break;
          case MEETING_ENDED_KEY:
            action1 = <PickWinnerButton onValidate={onPickWinner} />;
            break;
          case CONTRACT_LOCKED_KEY:
            action1 = <p>FIN</p>;
            break;
        }

      } else {
        action1 = <p>ATTENDRE...</p>;
        switch (status) {
          case PROPOSAL_REGISTRATION_STARTED_KEY:
            action1 = <SubmitProposalInput onValidate={onSubmittedProposal} />;
            break;
          case VOTING_SESSIONS_STARTED_KEY:
            if (userVoted === false) {
              action1 = (
                <VoteInput proposals={proposals} onValidate={onVoted} />
              );
            } else {
              action1 = <p>You already voted. wait for votes tallied</p>;
            }
        }
      }
    }
  }

  return (
    <div className={classes.Actions}>
      <h3>
        <u>ACTIONS:</u> <i className="snes-jp-logo"></i>
      </h3>
      {action1}
      <hr />
      {action2}
    </div>
  );
};

export default Actions;
