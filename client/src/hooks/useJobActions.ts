import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { ANVIL_VOTINGOPTI_ADRESS } from "../../constants/deployed";
import { abi } from "../../constants/abi";



export const useAddCustomer = () => {
    const { data: hash, error, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const addCustomer = (firstName: string, lastName: string, customerAddress: string, account: string | undefined) => {
        if (account) {
            writeContract({
                address: ANVIL_VOTINGOPTI_ADRESS,
                abi: abi,
                functionName: "addCustomer",
                args: [firstName, lastName, customerAddress],
                account: account as `0x${string}` // Type assertion
            });
        }
    };

    return { hash, error, isConfirming, isConfirmed, addCustomer };
};

// export const useFinishJob = (jobId: number, account: string | undefined) => {
//   const { data: hash, error, writeContract } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

//   const finishJob = () => {
//     if (account) {
//       writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "setIsFinishedAndPay",
//         args: [jobId],
//         account: account as `0x${string}` // Type assertion
//       });
//     }
//   };

//   return { hash, error, isConfirming, isConfirmed, finishJob };
// };
