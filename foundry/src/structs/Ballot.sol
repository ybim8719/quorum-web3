// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

enum BallotWorkflowStatus {
    BallotInitialized,
    MeetingStarted,
    ProposalVotingOpen,
    ProposalVotingClosed,
    ProposalVotingCountingDone,
    MeetingEnded,
    ContractLocked
}

enum VotingResult {
    Pending,
    Approved,
    Refused,
    Draw
}

struct Vote {
    address customer;
    string firstName;
    string lastName;
}

struct Proposal {
    string content;
    address authorFirstName;
    address authorLastName;
    uint256 quorum;
    VotingResult votingResult;
    Vote[] approvals;
    Vote[] refusals;
}
