// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Customer {
    bool isRegistered;
    string lastName;
    string firstName;
    uint256 lotId;
    string lotOfficialNumber;
}

struct CustomerView {
    bool isRegistered;
    string lastName;
    string firstName;
    address customerAddress;
    uint256 lotId;
    string lotOfficialNumber;
}

struct Lot {
    address customerAddress;
    uint256 shares;
    string lotOfficialNumber;
    bool isTokenized;
}

struct LotView {
    uint256 id;
    address customerAddress;
    uint256 shares;
    string lotOfficialNumber;
    string lastName;
    string firstName;
    bool isTokenized;
}

struct GeneralMeeting {
    uint256 id;
    uint256 earlyVotingStart;
    uint256 meetingStart;
}

struct CondoGeneralInfo {
    string condoName;
    string description;
    string postalAddress;
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
