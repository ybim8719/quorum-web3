

import { useState } from "react";

interface IAddLotInputProps {
    onValidate: (officialCode: string, shares: number) => void;
}

const AddLotInput = ({ onValidate }: IAddLotInputProps) => {
    const [enteredOfficialCode, setEnteredOfficialCode] = useState("");
    const [enteredShares, setEnteredShares] = useState(0);

    const submitHandler = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        onValidate(enteredOfficialCode, enteredShares);
        setEnteredOfficialCode("");
        setEnteredShares(0);
    };

    return (
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
                Shares :
                <input
                    value={enteredShares}
                    onChange={(e) => setEnteredShares(+e.target.value)}
                    type="number"
                    id="inline_field"
                    className="nes-input is-success"
                    placeholder="Type last name..."
                />
            </label>

            <input type="submit" value="Send Tx" className="nes-btn is-success" />
        </form>
    );
};

export default AddLotInput;
