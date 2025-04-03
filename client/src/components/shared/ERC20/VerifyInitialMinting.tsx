import { TOKEN_STATUS_INSTRUCTIONS, INITIAL_MINTING_KEY } from "../../../models/ERC20";
import { CUSTOMER_ROLE, OWNER_ROLE } from "../../../models/roles";


interface IVerifyInitialMinting {
    balanceOfOwner: number;
    totalSupply: number;
    onValidate: () => void;
    role: string;
    currentStatus: string;
}

const VerifyInitialMinting = ({ balanceOfOwner, totalSupply, onValidate, role, currentStatus }: IVerifyInitialMinting) => {
    // check the supply of erc20 totalSupply and balance of owner
    return (
        <div className="section">
            <i className="nes-icon is-large star"></i>
            <p>{TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].description}</p>
            {role === OWNER_ROLE &&
                <p>{TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].ownerInstruction}</p>}
            {role === CUSTOMER_ROLE &&
                <p>{TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].customerInstruction}</p>}
            <p>Total minted: {totalSupply}/1000</p>
            <p>Owner's balance: {balanceOfOwner}/1000</p>
            {(role === OWNER_ROLE && currentStatus === INITIAL_MINTING_KEY) && <button className="nes-btn is-primary" onClick={() => onValidate()}>VALIDATE</button>}
        </div>
    );
};

export default VerifyInitialMinting;
