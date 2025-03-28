import { token_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";

export const useReadTokenQueries = (deployedTokenAddress: string) => {
    const { address } = useAccount();

    const useFetchedTotalSupply = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "totalSupply",
        account: address,
    });

    const useFetchedGeneralInfo = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "getGeneralInfo",
        account: address,
    });

    return {
        useFetchedGeneralInfo,
        useFetchedTotalSupply
    };
};

export const useReadTokenBalanceOf = (requestedAddress: string, deployedTokenAddress: string) => {
    const { address } = useAccount();

    const useFetchedBalanceOf = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "getLotsInfos",
        account: address,
        args: [requestedAddress]
    });

    return {
        useFetchedBalanceOf,
    };
};


//https://wagmi.sh/core/api/actions/readContract