import { readContract } from "@wagmi/core";
import { token_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";
import { http, createConfig } from '@wagmi/core'
import { anvil, sepolia } from '@wagmi/core/chains'

export const useReadTokenQueries = (deployedTokenAddress: string) => {
    const { address } = useAccount();

    const useFetchedTotalSupply = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "totalSupply",
        account: address,
    });

    const useFetchedERC20CurrentStatus = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "getCurrentStatus",
        account: address,
    });

    return {
        useFetchedERC20CurrentStatus,
        useFetchedTotalSupply
    };
};

export const config = createConfig({
    chains: [anvil, sepolia],
    transports: {
        [anvil.id]: http(),
        [sepolia.id]: http(),
    },
})

export const triggerGetBalance = async (contractAddres: string, addressToGetBalanceFrom: string) => {
    return await readContract(config, {
        abi: token_abi,
        address: contractAddres as `0x${string}`,
        functionName: 'balanceOf',
        args: [addressToGetBalanceFrom]
    })
}



