pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BallotWorkflowStatus, Voter, Proposal} from "./structs/Ballot.sol";

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
    mapping(uint256 proposalId => Proposal) s_proposals;
    uint256 s_currentProposalBeingVoted;
    uint256 s_nbOfProposals;
    uint256 s_nextProposalId;
    // when a customer signs attendance at GM, token shares are verified
    mapping(address attendee => Voter) _attendees;
    BallotWorkflowStatus s_currentStatus;

    /*//////////////////////////////////////////////////////////////
                            IMMUTABLEs
    //////////////////////////////////////////////////////////////*/
    address s_tokenAddress;
    address i_managerAddress;
    string i_description;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/

    constructor(string memory _description, address _managerAddress) Ownable(_msgSender()) {
        i_description = _description;
        i_managerAddress = _managerAddress;
    }

    function addLot(address customerAddress, uint256 _fefsfserf, string memory lotOfficialNumber, bool isTokenized)
        external
    {}

    // INTERFACE write
    // vote for a proposal
    // startNextProposalVoting()
    // endCurrentProposalVoting()
    // countCurrentProposalVoting()

    // INTERFACE read
    // getCurrentStatus
    // hasVoted
    // getProposalById (contains proposal name and results)
}
