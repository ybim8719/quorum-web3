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

struct Voter {
    bool tokenVerified;
    string firstName;
    string lastName;
    uint256 shares;
    string lotOfficialNumber;
}

struct Proposal {
    string description;
    VotingResult votingResult;
    address[] approvals;
    uint256 approvalShares;
    address[] refusals;
    uint256 refusalShares;
}
