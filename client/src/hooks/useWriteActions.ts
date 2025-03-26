import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { manager_abi } from "../../constants/deployed";

export const useAddCustomer = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const addCustomerWrite = (
    firstName: string,
    lastName: string,
    customerAddress: string,
    account: string | undefined,
    deployedManagerAddress: string
  ) => {
    if (account) {
      writeContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "registerCustomer",
        args: [firstName, lastName, customerAddress],
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, addCustomerWrite };
};

export const useAddLot = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const addLotWrite = (
    officialCode: string,
    shares: number,
    account: string | undefined,
    deployedManagerAddress: string
  ) => {
    if (account) {
      writeContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "registerLot",
        args: [officialCode, shares],
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, addLotWrite };
};

export const useLinkCustomerToLot = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const linkCustomerToLotWrite = (
    customerAddress: string,
    lotId: number,
    account: string | undefined,
    deployedManagerAddress: string
  ) => {
    if (account) {
      writeContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "linkCustomerToLot",
        args: [customerAddress, lotId],
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, linkCustomerToLotWrite };
};

export const useCreateERC20 = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const createERC20Write = (account: string | undefined, deployedManagerAddress: string) => {
    if (account) {
      writeContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "createGMSharesToken",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, createERC20Write };
};
