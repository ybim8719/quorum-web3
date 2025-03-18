// import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

// export const useTakeJob = (jobId: number, account: string | undefined) => {
//   const { data: hash, error, writeContract } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

//   const takeJob = () => {
//     if (account) {
//       writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "takeJob",
//         args: [jobId],
//         account: account as `0x${string}` // Type assertion
//       });
//     }
//   };

//   return { hash, error, isConfirming, isConfirmed, takeJob };
// };

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
