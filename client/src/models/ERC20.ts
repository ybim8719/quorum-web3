export const INITIAL_MINTING_KEY = "InitialMinting";
export const TRANSFERING_SHARES_KEY = "TransferingShares";
export const CONTRACT_LOCK_KEY = "ContractLocked";

export const TOKEN_STATUS_INSTRUCTIONS: Record<
    string,
    {
        statusId: number;
        title: string;
        description: string;
        ownerInstruction: string;
        customerInstruction: string;
    }
> = {
    [INITIAL_MINTING_KEY]: {
        statusId: 0,
        title: "Initial Minting",
        description: "Token was deployed and shares were minted !",
        ownerInstruction: " Verify your balance and click to proceed, please: ",
        customerInstruction: "transfering of shares will happen soon",
    },
    [TRANSFERING_SHARES_KEY]: {
        statusId: 1,
        title: "Transfering Shares",
        description: "Owner is actually proceeding to tokenization of shares",
        ownerInstruction:
            "Token all the shares of each lot to handle the rest",
        customerInstruction: "Verify during the process",
    },
    [CONTRACT_LOCK_KEY]: {
        statusId: 2,
        title: "ContractLocked",
        description:
            "Contract Locked forever ",
        ownerInstruction:
            "Nothing to do ",
        customerInstruction: "Nothing to do",
    },
};