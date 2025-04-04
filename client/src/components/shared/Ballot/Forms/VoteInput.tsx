import { useState } from "react";
import { formatProposal } from "../../../../models/utils";


interface IVoteInput {
  onValidate: (entered: number) => void;
}

const VOTING_PROPOSALS = [
  { id: 0, description: "Approve" },
  { id: 1, description: "Refuse" },
  { id: 2, description: "Blank vote" }
]

const VoteInput = ({ onValidate }: IVoteInput) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");

  function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedProposalId) {
      onValidate(+selectedProposalId);
    }
    setSelectedProposalId("");
  }

  return (
    <div className="section">
      <i className="nes-icon is-large heart"></i>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Vote for this proposal:
          <select
            value={selectedProposalId}
            onChange={(e) => setSelectedProposalId(e.target.value)}
          >
            <option value="" defaultValue={""}>Select a choice</option>
            {VOTING_PROPOSALS.map((p) => {
              return (
                <option value={p.id} key={`p-${p.id}`}>
                  {formatProposal(p.id, p.description)}
                </option>
              );
            })}
          </select>
        </label>
        <button className="nes-btn is-primary" type="submit">
          Send Tx
        </button>
      </form>
    </div>
  );
};

export default VoteInput;
