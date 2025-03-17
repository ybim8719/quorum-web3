// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Customer {
    bool isRegistered;
    string lastName;
    string firstName;
    uint256[] lotIds;
}

struct Admin {
    string lastName;
    string firstName;
    address adminAddress;
}

struct Condominium {
    uint256 nbOfLots;
    uint256 currentTotalShares;
    string postalAddress;
    string description;
    string trigram;
    string nextLotId;
    uint256[] lotIds;
}

struct CondominiumLot {
    address ownerAddress;
    uint256 shares;
    string lotInternalNumber;
    uint256 condoId;
}

struct CondominiumLotView {
    address customerAddress;
    uint256 shares;
    string lotInternalNumber;
    string lastName;
    string firstName;
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
