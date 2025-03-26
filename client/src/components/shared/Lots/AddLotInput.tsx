import { useState } from "react";

interface IAddLotInputProps {
  remainingSharesToGrant: number;
  onValidate: (officialCode: string, shares: number) => void;
}

const AddLotInput = ({
  remainingSharesToGrant,
  onValidate,
}: IAddLotInputProps) => {
  const [enteredOfficialCode, setEnteredOfficialCode] = useState("");
  const [enteredShares, setEnteredShares] = useState(0);

  const submitHandler = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    onValidate(enteredOfficialCode, enteredShares);
    setEnteredOfficialCode("");
    setEnteredShares(0);
  };

  if (remainingSharesToGrant === 0) {
    return (
      <>
        <h3>ADD LOT</h3>
        <p>Can't add anymore lots / Total Max shares of 1000 reached! </p>
      </>
    );
  }

  return (
    <>
      <h3>ADD LOT</h3>
      <form onSubmit={submitHandler}>
        <label htmlFor="inline_field">
          Official code:
          <input
            value={enteredOfficialCode}
            onChange={(e) => setEnteredOfficialCode(e.target.value)}
            type="text"
            id="inline_field"
            className="nes-input is-success"
            placeholder="Type lot official code..."
          />
        </label>
        <label htmlFor="inline_field">
          Shares (1-{remainingSharesToGrant}):
          <input
            value={enteredShares}
            onChange={(e) => setEnteredShares(+e.target.value)}
            type="number"
            min="1"
            max={remainingSharesToGrant}
            id="inline_field"
            className="nes-input is-success"
            placeholder="Type last name..."
          />
        </label>

        <input type="submit" value="Send Tx" className="nes-btn is-success" />
      </form>
    </>
  );
};

export default AddLotInput;
