// import classes from './SubmitProposalInput.module.css';

import { useState } from "react";

interface ISubmitProposalInput {
  onValidate: (entered: string) => void;
}

const SubmitProposalInput = ({ onValidate }: ISubmitProposalInput) => {
  const [entered, setEntered] = useState("");
  const submitHandler = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    onValidate(entered);
    setEntered("");
  };

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setEntered(event.target.value);
  }

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="inline_field">
        Add a Proposal:
        <textarea
          value={entered}
          onChange={handleChange}
          id="inline_field"
          className="nes-input is-success"
          placeholder="Enter a description..."
          required
        />
      </label>
      <input type="submit" value="Send Tx" className="nes-btn is-success" />
    </form>
  );
};

export default SubmitProposalInput;
