import { abi } from "../../constants/abi";
import { ANVIL_FACTORY_ADRESS } from "../../constants/deployed";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";

export const useWalletQueries = () => {
  const { address } = useAccount();

  const useFetchedLots = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: abi,
      functionName: "getCustomerLots",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  const useFetchedCustomers = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: abi,
      functionName: "getCustomers",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  const useFetchedOwner = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: abi,
      functionName: "owner",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  const useFetchedCustomersAddresses = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: abi,
      functionName: "customersList",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  return {
    useFetchedLots,
    useFetchedCustomers,
    useFetchedOwner,
    useFetchedCustomersAddresses,
  };
};
