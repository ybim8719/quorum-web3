// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

enum BallotWorkflowStatus {
    WaitingForGmData,
    ProposalsSubmittingOpen,
    ProposalsSubmittingClsode,
    ProposalBeingDiscussed,
    ProposalVotingOpen,
    ProposalVotingCountRevealed,
    MeetingEnded,
    ContractLocked
}

enum VotingResult {
    Draw,
    Pending,
    Approved,
    Refused
}

struct Voter {
    bool tokenVerified;
    string firstName;
    string lastName;
    uint256 shares;
    string lotOfficialNumber;
}

struct Proposal {
    string content;
    uint256 quorum;
    VotingResult votingResult;
    address[] approvals;
    uint256 approvalShares;
    address[] refusals;
    uint256 refusalShares;
}
