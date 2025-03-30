import { manager_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";

export const useReadManagerQueries = (deployedManagerAddress: string) => {
  const { address } = useAccount();

  const useFetchedLots = useReadContract({
    address: deployedManagerAddress as `0x${string}`,
    abi: manager_abi,
    functionName: "getLotsInfos",
    account: address,
  });

  const useFetchedCustomers = useReadContract({
    address: deployedManagerAddress as `0x${string}`,
    abi: manager_abi,
    functionName: "getCustomersInfos",
    account: address,
  });

  const useFetchedOwner = useReadContract({
    address: deployedManagerAddress as `0x${string}`,
    abi: manager_abi,
    functionName: "owner",
    account: address,
  });

  const useFetchedCustomersAddresses = useReadContract({
    address: deployedManagerAddress as `0x${string}`,
    abi: manager_abi,
    functionName: "getCustomersList",
    account: address,
  });

  const useFetchedERC20Address = useReadContract({
    address: deployedManagerAddress as `0x${string}`,
    abi: manager_abi,
    functionName: "getERC20Address",
    account: address,
  });

  return {
    useFetchedLots,
    useFetchedCustomers,
    useFetchedOwner,
    useFetchedCustomersAddresses,
    useFetchedERC20Address,
  };
};
