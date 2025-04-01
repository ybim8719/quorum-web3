import { STATUS_INSTRUCTIONS } from "../../../models/ballot";
import { ADMIN_ROLE } from "../../../models/roles";

interface StatusProps {
  status: keyof typeof STATUS_INSTRUCTIONS | null;
  role: string;
}

const StatusInstructions = ({ status, role }: StatusProps) => {
  if (status === null || Object.keys(STATUS_INSTRUCTIONS).includes(status) === false) {
    return <p>Undefined Status</p>;
  }

  let instructions = STATUS_INSTRUCTIONS[status]["customerInstruction"];
  if (role === ADMIN_ROLE) {
    instructions = STATUS_INSTRUCTIONS[status]["ownerInstruction"];
  }

  return (
    <div className="">
      <h2>
        <u>
          <b>
            Status: {STATUS_INSTRUCTIONS[status].title} (
            {STATUS_INSTRUCTIONS[status].statusId + 1} / 8)
          </b>
        </u>
      </h2>
      <p>
        <u>Description:</u> {STATUS_INSTRUCTIONS[status].description}
      </p>
      <p>
        <u>Instructions</u>: {instructions}
      </p>
    </div>
  );
};

export default StatusInstructions;
