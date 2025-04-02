import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ballot_abi } from "../../constants/deployed";


export const useSubmitProposal = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const submitProposalWrite = (
    description: string,
    account: string | undefined,
    ballotAddress: string
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "submitProposal",
        args: [description],
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, submitProposalWrite };
};

export const useSetProposalsSubmittingClosed = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setProposalsSubmittingClosedWrite = (
    account: string | undefined,
    ballotAddress: string
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "setProposalsSubmittingClosed",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, setProposalsSubmittingClosedWrite };
};

export const useSetProposalBeingDiscussedStatusOrEndBallot = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setProposalBeingDiscussedStatusWrite = (
    account: string | undefined,
    ballotAddress: string
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "setProposalBeingDiscussedStatusOrEndBallot",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, setProposalBeingDiscussedStatusWrite };
};

export const useSetProposalVotingOpenStatus = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setProposalVotingOpenStatusWrite = (
    account: string | undefined,
    ballotAddress: string
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "setProposalVotingOpenStatus",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, setProposalVotingOpenStatusWrite };
};

export const useVoteForCurrentProposal = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const voteForCurrentProposalWrite = (
    account: string | undefined,
    ballotAddress: string,
    voteEnum: number
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "voteForCurrentProposal",
        account: account as `0x${string}`,
        args: [voteEnum]
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, voteForCurrentProposalWrite };
};

export const useSetCurrentProposalVotingCountReveal = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setCurrentProposalVotingCountRevealWrite = (
    account: string | undefined,
    ballotAddress: string
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "setCurrentProposalVotingCountReveal",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, setCurrentProposalVotingCountRevealWrite };
};

export const useLockContract = () => {
  const { data: hash, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const lockContractWrite = (
    account: string | undefined,
    ballotAddress: string
  ) => {
    if (account) {
      writeContract({
        address: ballotAddress as `0x${string}`,
        abi: ballot_abi,
        functionName: "lockContract",
        account: account as `0x${string}`,
      });
    }
  };

  return { hash, error, isConfirming, isConfirmed, lockContractWrite };
};
