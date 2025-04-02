import { ballot_abi } from "../../constants/deployed";
import { useReadContract, useAccount } from "wagmi";

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

    const useFetchedCurrentMinimalProposal = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getCurrentMinimalProposal",
        account: address,
    });

    const useFetchedCurrentProposalComplete = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getCurrentProposalComplete",
        account: address,
    });

    const useFetchedVotersOfCurrentProposal = useReadContract({
        address: deployedBallotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "getVotersOfCurrentProposal",
        account: address,
    });


    return {
        useFetchedBallotStatus,
        useFetchedCompleteProposals,
        useFetchedMinProposals,
        useFetchedCurrentMinimalProposal,
        useFetchedCurrentProposalComplete,
        useFetchedVotersOfCurrentProposal
    };
};





