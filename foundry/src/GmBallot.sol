pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BallotWorkflowStatus, Voter, Proposal, VoteType} from "./structs/Ballot.sol";
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
    error GMBallot__OnlyCustomerAuthorized(address unauthorized);
    error GMBallot__DescriptionCantBeEmpty();
    error GMBallot__LastProposalWasAlreadyHandled();
    error GMBallot__LastProposalStillBeingHandled();
    error GMBallot__ProposalBeingHandledCantBeNull();
    error GMBallot__InexistentVoteType();
    error GMBallot__ProposalIdNotFound(uint256 proposalId);
    error GMBallot__AlreadyVotedForThisProposal(uint256 proposalId, address voter);

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

    modifier customerOnly() {
        if (s_voters[msg.sender].tokenVerified == false) {
            revert GMBallot__OnlyCustomerAuthorized(msg.sender);
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    event ProposalRegistered();
    event ProposalVotingOpen(uint256 proposalId);

    constructor(string memory _description, address _managerAddress) Ownable(_msgSender()) {
        i_description = _description;
        i_managerAddress = _managerAddress;
        s_nextProposalId = 1;
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> voteregisterVoterrs
    //////////////////////////////////////////////////////////////*/
    function setERC20Address(address _tokenAddress) external onlyManager {
        if (s_ERC20Address != address(0)) {
            revert GMBallot__TokenAlreadyRegistered();
        }
        s_ERC20Address = _tokenAddress;
    }

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
            Voter storage voter = s_voters[_customerAddress];
            voter.tokenVerified = true;
            voter.firstName = _customerFirstName;
            voter.lastName = _customerLastName;
            voter.shares = _shares;
            voter.lotOfficialNumber = _lotOfficialNumber;
            ++s_nbOfVoters;
        }
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> proposals
    //////////////////////////////////////////////////////////////*/
    function setProposalsSubmittingOpen() external onlyOwner {
        if (s_currentStatus != BallotWorkflowStatus.WaitingForGmData) {
            revert GMBallot__InvalidPeriod();
        }

        if (s_nbOfVoters == 0) {
            revert GMBallot__RegisterVotersFirst();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalsSubmittingOpen;
    }

    /// @param _description is the body of the description
    /// @notice any voter address can add description and a proposalId (starting from 1) will be granted to the proposal
    function submitProposal(string calldata _description) external customerOnly {
        if (s_currentStatus != BallotWorkflowStatus.ProposalsSubmittingOpen) {
            revert GMBallot__InvalidPeriod();
        }
        if (bytes(_description).length == 0) {
            revert GMBallot__DescriptionCantBeEmpty();
        }
        Proposal storage proposal = s_proposals[s_nextProposalId];
        proposal.description = _description;
        proposal.isRegistered = true;

        emit ProposalRegistered();
        // increment id for next proposal submitting
        ++s_nextProposalId;
        ++s_nbOfProposals;
    }

    function setProposalsSubmittingClosed() external onlyOwner {
        if (s_currentStatus != BallotWorkflowStatus.ProposalsSubmittingOpen) {
            revert GMBallot__InvalidPeriod();
        }

        if (s_nbOfProposals == 0) {
            revert GMBallot__ProposalsAreEmpty();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalsSubmittingClosed;
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> voting 
    //////////////////////////////////////////////////////////////*/
    // this  is a cycle between status discuttings => openvoting => countVote
    function setProposalBeingDiscussedStatusOrEndBallot() external onlyOwner {
        // if it's the first proposal to be discussed, then current Status must be ProposalsSubmittingClosed
        if (s_currentProposalBeingVoted == 0 && s_currentStatus != BallotWorkflowStatus.ProposalsSubmittingClosed) {
            revert GMBallot__InvalidPeriod();
        }
        // if it's the n-proposal to be discussed, then current status must be ProposalVotingCountRevealed (because it was n-1 proposal)
        if (s_currentProposalBeingVoted > 0 && s_currentStatus != BallotWorkflowStatus.ProposalVotingCountRevealed) {
            revert GMBallot__LastProposalStillBeingHandled();
        }
        // if it's the last proposal being discussed,
        if (s_currentProposalBeingVoted == s_nbOfProposals) {
            if (s_currentStatus == BallotWorkflowStatus.ProposalVotingCountRevealed) {
                /// last proposal was revealed, ballot is achieved
                s_currentStatus = BallotWorkflowStatus.MeetingEnded;
            } else {
                revert GMBallot__LastProposalStillBeingHandled();
            }
        }
        // proposal id is now set for discussion and future votes
        ++s_currentProposalBeingVoted;
        s_currentStatus = BallotWorkflowStatus.ProposalBeingDiscussed;
    }

    function setProposalVotingOpenStatus() external onlyOwner {
        // prior step must definitively be ProposalBeingDiscussed
        if (s_currentStatus != BallotWorkflowStatus.ProposalBeingDiscussed) {
            revert GMBallot__InvalidPeriod();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalVotingOpen;
    }

    function vote(uint256 _proposalId, uint256 _voteEnum) external customerOnly {
        if (s_currentStatus != BallotWorkflowStatus.ProposalVotingOpen) {
            revert GMBallot__InvalidPeriod();
        }
        if (s_proposals[_proposalId].isRegistered == false) {
            revert GMBallot__ProposalIdNotFound(_proposalId);
        }
        if (_voteEnum > uint256(VoteType.Blank)) {
            revert GMBallot__InexistentVoteType();
        }
        if (_checkIfHasAlreadyVoted(_proposalId, msg.sender)) {
            revert GMBallot__AlreadyVotedForThisProposal(_proposalId, msg.sender);
        }

        VoteType formatedVote = VoteType(_voteEnum);
        Voter memory voter = s_voters[msg.sender];
        if (formatedVote == VoteType.Approval) {
            s_proposals[_proposalId].approvals.push(msg.sender);
            s_proposals[_proposalId].approvalShares += voter.shares;
        } else if (formatedVote == VoteType.Refusal) {
            s_proposals[_proposalId].refusals.push(msg.sender);
            s_proposals[_proposalId].refusalShares += voter.shares;
        } else if (formatedVote == VoteType.Blank) {
            s_proposals[_proposalId].blankVotes.push(msg.sender);
            s_proposals[_proposalId].blankVotesShares += voter.shares;
        }

        s_voters[msg.sender].votedProposalIds.push(_proposalId);
    }

    function _checkIfHasAlreadyVoted(uint256 _proposalId, address _customerAddress) internal view returns (bool) {
        uint256 nfOfVotes = s_voters[_customerAddress].votedProposalIds.length;
        if (s_voters[_customerAddress].votedProposalIds.length == 0) {
            return false;
        }

        for (uint256 i; i < nfOfVotes; i++) {
            if (s_voters[_customerAddress].votedProposalIds[i] == _proposalId) {
                return true;
            }
        }

        return false;
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> voting 
    //////////////////////////////////////////////////////////////*/

    function lockContract() external onlyOwner {
        // must be MeetingEnded

        // do count add set results of the proposals
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

    function getNextProposalId() external view returns (uint256) {
        return s_nextProposalId;
    }

    function getVoter(address _voter) external view returns (Voter memory) {
        return s_voters[_voter];
    }
    // TODO PROTECT THIS SHIT while given proposal is maybe being voted

    function getProposal(uint256 _lotId) external view returns (Proposal memory) {
        return s_proposals[_lotId];
    }

    function getNbOfPrpposals() external view returns (uint256) {
        return s_nbOfProposals;
    }
}
