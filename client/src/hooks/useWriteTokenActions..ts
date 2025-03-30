import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { manager_abi } from "../../constants/deployed";

export const useValidateMinting = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const validateMintingWrite = (
    account: string | undefined,
    deployedManagerAddress: string
  ) => {
    if (account) {
      writeContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "openTokenizingOfShares",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, validateMintingWrite };
};


export const useTranferShares = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const transferSharesWrite = (
    account: string | undefined,
    deployedManagerAddress: string,
    lotId: number
  ) => {
    if (account) {
      writeContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "convertLotSharesToToken",
        account: account as `0x${string}`,
        args: [lotId]
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, transferSharesWrite };
};
