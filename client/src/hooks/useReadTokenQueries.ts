import { readContract } from "@wagmi/core";
import { token_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";
import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'

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

export const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})

export const triggerReadContract = async (contractAddres: string, addressToGetBalanceFrom: string) => {
    const result = await readContract(config, {
        abi: token_abi,
        address: contractAddres as ,
        functionName: 'balanceOf',
        args: [addressToGetBalanceFrom]
    })
}

