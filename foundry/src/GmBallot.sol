pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BallotWorkflowStatus, Vote, Proposal} from "./structs/Ballot.sol";

/// @notice Will store results from general Meeting proposals votings made in session
/// @dev inherits OpenZep ownable
contract GMBallot is Ownable {
    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    // error GMBallot__Unauthorized(address unauthorizedVoter);

    /*//////////////////////////////////////////////////////////////
                         Immutables and constants
    //////////////////////////////////////////////////////////////*/
    // string i_postalAddress;

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    BallotWorkflowStatus s_currentStatus;
    uint256 s_nextProposalId;
    mapping(uint256 proposalId => Proposal) s_proposals;
    uint256 s_currentProposalBeingVoted;
    uint256 s_nbOfProposals;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/

    constructor(string memory _name, string memory _description, string memory _postalAddress, uint256 _maxAdminNb)
        Ownable(_msgSender())
    {}

    // INTERFACE write
    // vote for a proposal

    // INTERFACE read
    // getCurrentStatus
    //hasVoted
    // getProposalById
}
