// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

enum BallotWorkflowStatus {
    BallotReady,
    AttendeesSigning,
    AttendeesSigningCountRevealed,
    ProposalBeingSubmitted,
    ProposalVotingOpen,
    ProposalVotingClosed,
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
    address customer;
    string firstName;
    string lastName;
    uint256 shares;
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
