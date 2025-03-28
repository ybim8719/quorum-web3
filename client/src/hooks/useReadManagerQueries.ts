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

  const useFetchedERC20Adress = useReadContract({
    address: deployedManagerAddress as `0x${string}`,
    abi: manager_abi,
    functionName: "getERC20Address",
    account: address,
  });

  //    getCustomerDetail(address _customerAddress)
  //    getLotById()

  return {
    useFetchedLots,
    useFetchedCustomers,
    useFetchedOwner,
    useFetchedCustomersAddresses,
    useFetchedERC20Adress,
  };
};
