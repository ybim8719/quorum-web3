pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BallotWorkflowStatus, Voter, Proposal} from "./structs/Ballot.sol";
import {GMSharesToken} from "./GmSharesToken.sol";

/// @notice Will store results from general Meeting proposals votings made in session
/// @dev inherits OpenZep ownable / will be deployed with manager contract in a script
contract GMBallot is Ownable {
    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    error GMBallot__Unauthorized(address unauthorizedVoter);
    error GMBallot__TokenMustLocked();
    error GMBallot__TokenAlreadyRegistered();
    error GMBallot__VoterAlreadyRegistered();
    error GMBallot__SharesCantBeZero();
    error GMBallot__OnlyManagerAuthorized();
    error GMBallot__InvalidPeriod();
    error GMBallot__RegisterVotersFirst();
    error GMBallot__ProposalsAreEmpty();

    /*//////////////////////////////////////////////////////////////
                         Immutables and constants
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    mapping(uint256 proposalId => Proposal) s_proposals;
    mapping(address attendee => Voter) s_voters;
    uint256 s_nbOfVoters;
    uint256 s_currentProposalBeingVoted;
    uint256 s_nbOfProposals;
    uint256 s_nextProposalId;
    address s_ERC20Address;
    // list of customers become voters
    BallotWorkflowStatus s_currentStatus;

    /*//////////////////////////////////////////////////////////////
                            IMMUTABLEs
    //////////////////////////////////////////////////////////////*/
    address i_managerAddress;
    string i_description;

    modifier onlyManager() {
        if (msg.sender != i_managerAddress) {
            revert GMBallot__OnlyManagerAuthorized();
        }
        _;
    }
    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    constructor(string memory _description, address _managerAddress) Ownable(_msgSender()) {
        i_description = _description;
        i_managerAddress = _managerAddress;
    }

    /*//////////////////////////////////////////////////////////////
                            WRITE func
    //////////////////////////////////////////////////////////////*/
    function registerVoter(
        address _customerAddress,
        string memory _customerFirstName,
        string memory _customerLastName,
        string memory _lotOfficialNumber,
        uint256 _shares
    ) external onlyManager {
        if (s_currentStatus != BallotWorkflowStatus.WaitingForGmData) {
            revert GMBallot__InvalidPeriod();
        }
        // Token must created and locked
        if (s_ERC20Address == address(0)) {
            revert GMBallot__TokenMustLocked();
        }
        // voter must not be already registered
        if (s_voters[_customerAddress].tokenVerified) {
            revert GMBallot__VoterAlreadyRegistered();
        }
        if (_shares == 0) {
            revert GMBallot__SharesCantBeZero();
        }
        uint256 balance = GMSharesToken(s_ERC20Address).balanceOf(_customerAddress);
        // verify that the owner has the correct rights
        if (balance == _shares) {
            Voter memory voter = Voter({
                tokenVerified: true,
                firstName: _customerFirstName,
                lastName: _customerLastName,
                shares: _shares,
                lotOfficialNumber: _lotOfficialNumber
            });
            s_voters[_customerAddress] = voter;
            ++s_nbOfVoters;
        }
    }

    function setERC20Address(address _tokenAddress) external onlyManager {
        if (s_ERC20Address != address(0)) {
            revert GMBallot__TokenAlreadyRegistered();
        }
        s_ERC20Address = _tokenAddress;
    }

    function setProposalsSubmittingOpen() external onlyOwner {
        if (s_currentStatus != BallotWorkflowStatus.WaitingForGmData) {
            revert GMBallot__InvalidPeriod();
        }

        if (s_nbOfVoters == 0) {
            revert GMBallot__RegisterVotersFirst();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalsSubmittingOpen;
    }

    function setProposalsSubmittingClosed() external onlyOwner {
        if (s_currentStatus != BallotWorkflowStatus.ProposalsSubmittingOpen) {
            revert GMBallot__InvalidPeriod();
        }

        if (s_nbOfProposals == 0) {
            revert GMBallot__ProposalsAreEmpty();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalsSubmittingOpen;
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW func
    //////////////////////////////////////////////////////////////*/
    function getERC20Address() external view returns (address) {
        return s_ERC20Address;
    }

    function getCurrentStatus() external view returns (BallotWorkflowStatus) {
        return s_currentStatus;
    }

    function getCurrentProposalBeingVoted() external view returns (uint256) {
        return s_currentProposalBeingVoted;
    }

    function getVoter(address _voter) external view returns (Voter memory) {
        return s_voters[_voter];
    }
}
