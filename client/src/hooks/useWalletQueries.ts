import { abi } from "../../constants/abi";
import { ANVIL_VOTINGOPTI_ADRESS } from "../../constants/deployed";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { type UseReadContractParameters } from "wagmi";

export const useQueries = () => {
  const { address } = useAccount();
  type IsetReadConfig = (functionName: string) => UseReadContractParameters;
  const setReadConfig: IsetReadConfig = (functionName: string) => {
    return {
      address: ANVIL_VOTINGOPTI_ADRESS,
      abi: abi,
      functionName: functionName,
      account: address,
      query: {
        enabled: true,
      },
    };
  };

  const usefetchedCurrentStatus = useReadContract(
    setReadConfig("getCurrentStatus"),
  );
  const usefetchedVoters = useReadContract(setReadConfig("getVotersList"));
  return {
    usefetchedCurrentStatus,
    usefetchedVoters,
  };
};
