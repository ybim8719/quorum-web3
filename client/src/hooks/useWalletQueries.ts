import { abi } from "../../constants/abi";
import { ANVIL_VOTINGOPTI_ADRESS } from "../../constants/deployed";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";

export const useQueries = () => {
  const { address } = useAccount();

  const usefetchedCurrentStatus = useReadContract(
    {
      address: ANVIL_VOTINGOPTI_ADRESS,
      abi: abi,
      functionName: "getCurrentStatus",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  const usefetchedVoters = useReadContract(
    {
      address: ANVIL_VOTINGOPTI_ADRESS,
      abi: abi,
      functionName: "getVotersList",
      account: address,
      query: {
        enabled: true,
      }
    }
  );

  return {
    usefetchedCurrentStatus,
    usefetchedVoters,
  };
};
