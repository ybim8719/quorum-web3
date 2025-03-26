import { ANVIL_FACTORY_ADRESS, manager_abi } from "../../constants/deployed";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";

export const useReadManagerQueries = () => {
  const { address } = useAccount();

  const useFetchedLots = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: manager_abi,
      functionName: "getLotsInfos",
      account: address,
    }
  );

  const useFetchedCustomers = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: manager_abi,
      functionName: "getCustomersInfos",
      account: address,

    }
  );

  const useFetchedOwner = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: manager_abi,
      functionName: "owner",
      account: address,
    }
  );

  const useFetchedCustomersAddresses = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: manager_abi,
      functionName: "getCustomersList",
      account: address,
    }
  );

  const useFetchedERC20Adress = useReadContract(
    {
      address: ANVIL_FACTORY_ADRESS,
      abi: manager_abi,
      functionName: "getErc20Address",
      account: address,
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
