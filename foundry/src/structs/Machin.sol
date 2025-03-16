// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Customer {
    bool isRegistered;
    string lastName;
    string firstName;
    CondominiumLot[] lots;
}

struct Condominium {
    uint256 id;
    uint256 nbOfLots;
    uint256 totalShares;
    string postalAddress;
    string description;
    CondominiumLot[] lots;
}

struct CondominiumLot {
    uint256 id;
    address ownerAddress;
    string lastName;
    string firstName;
    uint256 shares;
    uint256 lotNumber;
}

struct GeneralMeeting {
    uint256 id;
    uint256 earlyVotingStart;
    uint256 meetingStart;
}

/*//////////////////////////////////////////////////////////////
                            ENUMS
//////////////////////////////////////////////////////////////*/
enum TokenWorkflowStatus {
    RegisteringShares,
    ApprovalsOpen,
    TokenLocked
}

enum GMWorkflowStatus {
    Beginning,
    EarlyVoting,
    SeanceDemarree,
    VoteEnCours,
    Depouillement,
    GMEnded,
    GMLocked
}
