import { token_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";

export const useReadTokenQueries = (deployedTokenAddress: string) => {
    const { address } = useAccount();

    const useFetchedBalanceOf = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "getLotsInfos",
        account: address,
    });

    const useFetchedGeneralInfo = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "getGeneralInfo",
        account: address,
    });

    return {
        useFetchedBalanceOf,
        useFetchedGeneralInfo
    };
};
