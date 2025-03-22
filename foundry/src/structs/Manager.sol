// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Customer {
    bool isRegistered;
    string lastName;
    string firstName;
    uint256[] lotIds;
}

struct CustomerView {
    bool isRegistered;
    string lastName;
    string firstName;
    address wallet;
    uint256[] lotIds;
}

struct Admin {
    string lastName;
    string firstName;
    address adminAddress;
}

struct CondominiumLot {
    address customerAddress;
    uint256 shares;
    string lotOfficialNumber;
}

struct CondominiumLotView {
    address customerAddress;
    uint256 shares;
    string lotOfficalNumber;
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
