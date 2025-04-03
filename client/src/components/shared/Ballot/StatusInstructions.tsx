import { BALLOT_STATUS_INSTRUCTIONS } from "../../../models/ballot";
import { OWNER_ROLE } from "../../../models/roles";

interface StatusProps {
  status: keyof typeof BALLOT_STATUS_INSTRUCTIONS | null;
  role: string;
}

const StatusInstructions = ({ status, role }: StatusProps) => {
  if (status === null || Object.keys(BALLOT_STATUS_INSTRUCTIONS).includes(status) === false) {
    return <p>Undefined Status</p>;
  }

  let instructions = BALLOT_STATUS_INSTRUCTIONS[status]["customerInstruction"];
  if (role === OWNER_ROLE) {
    instructions = BALLOT_STATUS_INSTRUCTIONS[status]["ownerInstruction"];
  }

  return (
    <div className="section">
      <h2>
        <u>
          <b>
            Status: {BALLOT_STATUS_INSTRUCTIONS[status].title} (
            {BALLOT_STATUS_INSTRUCTIONS[status].statusId + 1}/8)
          </b>
        </u>
      </h2>
      <p>
        <u>Description:</u> {BALLOT_STATUS_INSTRUCTIONS[status].description}
      </p>
      <p>
        <u>Instructions</u>: {instructions}
      </p>
    </div>
  );
};

export default StatusInstructions;
