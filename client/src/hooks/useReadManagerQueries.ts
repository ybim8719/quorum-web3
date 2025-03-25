import { abi } from "../../constants/abi";
import { ANVIL_FACTORY_ADRESS } from "../../constants/deployed";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";

export const useReadManagerQueries = () => {
  const { address } = useAccount();

  const useFetchedLots = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: abi,
      functionName: "getLotsInfos",
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
      functionName: "getCustomersInfos",
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
      functionName: "getCustomersList",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  const useFetchedERC20Adress = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: abi,
      functionName: "getErc20Address",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  //    getCustomerDetail(address _customerAddress)
  //    getLotById()

  return {
    useFetchedLots,
    useFetchedCustomers,
    useFetchedOwner,
    useFetchedCustomersAddresses,
    useFetchedERC20Adress
  };
};
