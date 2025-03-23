// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Customer {
    bool isRegistered;
    string lastName;
    string firstName;
    uint256 lotId;
}

struct CustomerView {
    bool isRegistered;
    string lastName;
    string firstName;
    address wallet;
    uint256 lotId;
}

struct Lot {
    address customerAddress;
    uint256 shares;
    string lotOfficialNumber;
    bool isTokenized;
}

struct LotView {
    address customerAddress;
    uint256 shares;
    string lotOfficialNumber;
    string lastName;
    string firstName;
}

struct Admin {
    string lastName;
    string firstName;
    address adminAddress;
}

struct GeneralMeeting {
    uint256 id;
    uint256 earlyVotingStart;
    uint256 meetingStart;
}

/*//////////////////////////////////////////////////////////////
                            ENUMS
//////////////////////////////////////////////////////////////*/

enum GMWorkflowStatus {
    Beginning,
    EarlyVoting,
    SeanceDemarree,
    VoteEnCours,
    Depouillement,
    GMEnded,
    GMLocked
}
