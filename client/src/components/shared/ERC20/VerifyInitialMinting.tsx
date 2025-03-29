import { TOKEN_STATUS_INSTRUCTIONS, INITIAL_MINTING_KEY } from "../../../models/ERC20";
import { ADMIN_ROLE, CUSTOMER_ROLE, OWNER_ROLE } from "../../../models/roles";


interface IVerifyInitialMinting {
    balanceOfOwner: number;
    totalSupply: number;
    onValidate: () => void;
    role: string;
}

const VerifyInitialMinting = ({ balanceOfOwner, totalSupply, onValidate, role }: IVerifyInitialMinting) => {
    // check the supply of erc20 totalSupply and balance of with queries
    return (
        <div className="">
            <h3>
                {TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].title}
            </h3>
            <p>{TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].description}</p>
            {role === OWNER_ROLE &&
                <p>{TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].ownerInstruction}</p>}
            {role === CUSTOMER_ROLE &&
                <p>{TOKEN_STATUS_INSTRUCTIONS[INITIAL_MINTING_KEY].customerInstruction}</p>}
            <p>Total minted:{totalSupply}/1000</p>
            <p>On Owner's balance:{balanceOfOwner}/1000</p>
            {role === OWNER_ROLE && <button onClick={() => onValidate()}>VALIDATE</button>}
        </div>
    );
};

export default VerifyInitialMinting;
