import { readContract } from "@wagmi/core";
import { ballot_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";
import { http, createConfig } from '@wagmi/core'
import { anvil } from '@wagmi/core/chains'

export const useReadBallotQueries = (deployedBallotAddress: string) => {
    const { address } = useAccount();

    const useFetchedCompleteProposals = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getProposalsComplete",
        account: address,
    });


    const useFetchedMinProposals = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getMinimalProposals",
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
        useFetchedCompleteProposals,
        useFetchedMinProposals
    };
};

export const config = createConfig({
    chains: [anvil],
    transports: {
        [anvil.id]: http(),
    },
})

export const triggerGetMinimalProposalById = async (deployedBallotAddress: string, proposalId: number) => {
    return await readContract(config, {
        abi: ballot_abi,
        address: deployedBallotAddress as `0x${string}`,
        functionName: 'getMinimalProposal',
        args: [proposalId]
    })
}

export const triggerGetCompleteProposalById = async (deployedBallotAddress: string, proposalId: number) => {
    return await readContract(config, {
        abi: ballot_abi,
        address: deployedBallotAddress as `0x${string}`,
        functionName: 'getProposalCompleteById',
        args: [proposalId]
    })
}


export const triggerGetVotersOfProposalId = async (deployedBallotAddress: string, proposalId: number) => {
    return await readContract(config, {
        abi: ballot_abi,
        address: deployedBallotAddress as `0x${string}`,
        functionName: 'getVotersOfProposal',
        args: [proposalId]
    })
}

