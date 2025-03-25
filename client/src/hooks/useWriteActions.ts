import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ANVIL_FACTORY_ADRESS } from "../../constants/deployed";
import { manager_abi } from "../../constants/deployed";

export const useAddCustomer = () => {
    const { data: hash, error, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const addCustomerWrite = (firstName: string, lastName: string, customerAddress: string, account: string | undefined) => {
        if (account) {
            writeContract({
                address: ANVIL_FACTORY_ADRESS,
                abi: manager_abi,
                functionName: "registerCustomer",
                args: [firstName, lastName, customerAddress],
                account: account as `0x${string}` // Type assertion
            });
        }
    };

    return { hash, error, isConfirming, isConfirmed, addCustomerWrite };
};

export const useAddLot = () => {
    const { data: hash, error, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const addLotWrite = (officialCode: string, shares: number, account: string | undefined) => {
        if (account) {
            writeContract({
                address: ANVIL_FACTORY_ADRESS,
                abi: manager_abi,
                functionName: "registerLot",
                args: [officialCode, shares],
                account: account as `0x${string}` // Type assertion
            });
        }
    };

    return { hash, error, isConfirming, isConfirmed, addLotWrite };
};


export const useLinkCustomerToLot = () => {
    const { data: hash, error, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const linkCustomerToLotWrite = (customerAddress: string, lotId: number, account: string | undefined) => {
        if (account) {
            writeContract({
                address: ANVIL_FACTORY_ADRESS,
                abi: manager_abi,
                functionName: "linkCustomerToLot",
                args: [customerAddress, lotId],
                account: account as `0x${string}` // Type assertion
            });
        }
    };

    return { hash, error, isConfirming, isConfirmed, linkCustomerToLotWrite };
};

