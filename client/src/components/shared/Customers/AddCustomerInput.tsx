import { useState } from "react";

interface IAddCustomerInputProps {
  onValidate: (firstName: string, lastName: string, address: string) => void;
}

const AddCustomerInput = ({ onValidate }: IAddCustomerInputProps) => {
  const [enteredFirstName, setEnteredFirstName] = useState("");
  const [enteredLastName, setEnteredLastName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");

  const submitHandler = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    onValidate(enteredFirstName, enteredLastName, enteredAddress);
    setEnteredFirstName("");
    setEnteredLastName("");
    setEnteredAddress("");
  };

  return (
    <div className="section">
      <h2>Register a new Customer</h2>
      <form onSubmit={submitHandler}>
        <label htmlFor="inline_field">
          <input
            value={enteredFirstName}
            onChange={(e) => setEnteredFirstName(e.target.value)}
            type="text"
            id="inline_field"
            className="nes-input is-success"
            placeholder="Type first name..."
            required
          />
        </label>
        <label htmlFor="inline_field">
          <input
            value={enteredLastName}
            onChange={(e) => setEnteredLastName(e.target.value)}
            type="text"
            id="inline_field"
            className="nes-input is-success"
            placeholder="Type last name..."
            required
          />
        </label>
        <label htmlFor="inline_field">
          <input
            value={enteredAddress}
            onChange={(e) => setEnteredAddress(e.target.value)}
            type="text"
            id="inline_field"
            className="nes-input is-success"
            placeholder="Type address..."
            required
          />
        </label>
        <input type="submit" value="Send Tx" className="nes-btn is-success" />
      </form>
    </div>
  );
};

export default AddCustomerInput;
