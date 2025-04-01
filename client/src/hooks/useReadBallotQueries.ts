import { readContract } from "@wagmi/core";
import { ballot_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";
import { http, createConfig } from '@wagmi/core'
import { anvil } from '@wagmi/core/chains'

export const useReadBallotQueries = (deployedBallotAddress: string) => {
    const { address } = useAccount();

    const useFetchedProposals = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getProposals",
        account: address,
    });


    const useFetchedMinProposals = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getMinProposals",
        account: address,
    });

    const useFetchedBallotStatus = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getCurrentStatus",
        account: address,
    });

    return {
        useFetchedBallotStatus,
        useFetchedProposals,
        useFetchedMinProposals
    };
};

export const config = createConfig({
    chains: [anvil],
    transports: {
        [anvil.id]: http(),
    },
})

export const triggerGetBalance = async (contractAddres: string, proposalId: number) => {
    return await readContract(config, {
        abi: ballot_abi,
        address: contractAddres as `0x${string}`,
        functionName: 'getProposal',
        args: [proposalId]
    })
}