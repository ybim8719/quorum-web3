import { manager_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";

export const useReadTokenQueries = (deployedManagerAddress: string) => {
    const { address } = useAccount();

    const useFetchedBalanceOf = useReadContract({
        address: deployedManagerAddress as `0x${string}`,
        abi: manager_abi,
        functionName: "getLotsInfos",
        account: address,
    });

    return {
        useFetchedBalanceOf,
    };
};
