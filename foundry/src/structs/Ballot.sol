// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

enum BallotWorkflowStatus {
    WaitingForGmData,
    ProposalsSubmittingOpen,
    ProposalsSubmittingClosed,
    ProposalBeingDiscussed,
    ProposalVotingOpen,
    ProposalVotingCountRevealed,
    MeetingEnded,
    ContractLocked
}

enum VotingResult {
    Pending,
    Approved,
    Refused,
    Draw
}

enum VoteType {
    Approval,
    Refusal,
    Blank
}

struct Voter {
    bool tokenVerified;
    string firstName;
    string lastName;
    uint256 shares;
    string lotOfficialNumber;
    uint256[] votedProposalIds;
}

struct Proposal {
    bool isRegistered;
    string description;
    VotingResult votingResult;
    address[] approvals;
    uint256 approvalShares;
    address[] refusals;
    uint256 refusalShares;
    address[] blankVotes;
    uint256 blankVotesShares;
}
