import { readContract } from "@wagmi/core";
import { token_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";
import { http, createConfig } from '@wagmi/core'
import { anvil } from '@wagmi/core/chains'

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

    const useFetchedCurrentStatus = useReadContract({
        address: deployedTokenAddress as `0x${string}`,
        abi: token_abi,
        functionName: "getCurrentStatus",
        account: address,
    });

    return {
        useFetchedGeneralInfo,
        useFetchedCurrentStatus,
        useFetchedTotalSupply
    };
};

export const config = createConfig({
    chains: [anvil],
    transports: {
        [anvil.id]: http(),
    },
})

export const triggerGetBalance = async (contractAddres: string, addressToGetBalanceFrom: string) => {
    console.log(contractAddres, "ERC20 contractAddres")
    console.log(addressToGetBalanceFrom, "manager address")

    return await readContract(config, {
        abi: token_abi,
        address: contractAddres as `0x${string}`,
        functionName: 'balanceOf',
        args: [addressToGetBalanceFrom]
    })
}



