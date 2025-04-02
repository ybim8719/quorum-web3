pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    BallotWorkflowStatus,
    Voter,
    Proposal,
    VoteType,
    VotingResult,
    ProposalView,
    MinVoter,
    MinimalProposalView
} from "./structs/Ballot.sol";
import {GMSharesToken} from "./GmSharesToken.sol";
import {console} from "forge-std/Test.sol";

/// @notice Will store results from general Meeting proposals votings made in session
/// @dev inherits OpenZep ownable / will be deployed with manager contract in a script

contract GMBallot is Ownable {
    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    error GMBallot__Unauthorized(address unauthorizedVoter);
    error GMBallot__TokenAlreadyRegistered();
    error GMBallot__SharesCantBeZero();
    error GMBallot__OnlyManagerAuthorized();
    error GMBallot__InvalidPeriod();
    error GMBallot__RegisterVotersFirst();
    error GMBallot__ProposalsAreEmpty();
    error GMBallot__OnlyCustomerAuthorized(address unauthorized);
    error GMBallot__DescriptionCantBeEmpty();
    error GMBallot__LastProposalStillBeingHandled();
    error GMBallot__InexistentVoteType();
    error GMBallot__ProposalIdNotFound(uint256 proposalId);
    error GMBallot__AlreadyVotedForThisProposal(uint256 proposalId, address voter);
    error GMBallot__VotingForWrongProposalId(uint256 proposalId);
    error GMBallot__LastProposalNotRevealedYet();
    error GMBallot__ContractLocked();

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    mapping(uint256 proposalId => Proposal) s_proposals;
    mapping(address attendee => Voter) s_voters;
    uint256 s_nbOfVoters;
    uint256 s_currentProposalBeingVoted;
    uint256 s_nbOfProposals;
    uint256 s_nextProposalId;
    uint256 s_currentTotalShares;
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

    modifier isContractLocked() {
        if (s_currentStatus == BallotWorkflowStatus.ContractLocked) {
            revert GMBallot__ContractLocked();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    event ProposalRegistered();
    event ProposalVotingOpen(uint256 proposalId);
    event ProposalVoteCountBeingRevealed(uint256 proposalId);
    event MeetingEnded();
    event ContractWasLocked();

    constructor(string memory _description, address _managerAddress) Ownable(_msgSender()) {
        i_description = _description;
        i_managerAddress = _managerAddress;
        s_nextProposalId = 1;
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> voteregisterVoterrs
    //////////////////////////////////////////////////////////////*/
    function setERC20Address(address _tokenAddress) external onlyManager isContractLocked {
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
    ) external onlyManager isContractLocked {
        if (s_currentStatus != BallotWorkflowStatus.WaitingForGmData) {
            revert GMBallot__InvalidPeriod();
        }
        if (_shares == 0) {
            revert GMBallot__SharesCantBeZero();
        }
        // verify by asking ERC20 that the owner has the correct rights
        uint256 balance = GMSharesToken(s_ERC20Address).balanceOf(_customerAddress);
        if (balance == _shares) {
            Voter storage voter = s_voters[_customerAddress];
            voter.tokenVerified = true;
            voter.firstName = _customerFirstName;
            voter.lastName = _customerLastName;
            voter.shares = _shares;
            voter.lotOfficialNumber = _lotOfficialNumber;
            ++s_nbOfVoters;
            s_currentTotalShares += _shares;
            if (s_currentTotalShares == 1000) {
                s_currentStatus = BallotWorkflowStatus.ProposalsSubmittingOpen;
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> proposals
    //////////////////////////////////////////////////////////////*/
    /// @param _description is the body of the description
    /// @notice any voter address can add description and a proposalId (starting from 1) will be granted to the proposal
    function submitProposal(string calldata _description) external customerOnly isContractLocked {
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

    function setProposalsSubmittingClosed() external onlyOwner isContractLocked {
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
    function setProposalBeingDiscussedStatusOrEndBallot() external onlyOwner isContractLocked {
        // if it's the first proposal to be discussed, then current Status must be ProposalsSubmittingClosed
        if (s_currentProposalBeingVoted == 0 && s_currentStatus != BallotWorkflowStatus.ProposalsSubmittingClosed) {
            revert GMBallot__InvalidPeriod();
        }
        // if it's the n-proposal to be discussed, then current status must be ProposalVotingCountRevealed (because it was n-1 proposal)
        if (s_currentProposalBeingVoted > 0 && s_currentStatus != BallotWorkflowStatus.ProposalVotingCountRevealed) {
            revert GMBallot__LastProposalStillBeingHandled();
        }
        // if the last proposal being discussed, close all ballots
        if (s_currentProposalBeingVoted == s_nbOfProposals) {
            if (s_currentStatus == BallotWorkflowStatus.ProposalVotingCountRevealed) {
                /// last proposal was revealed, ballot is achieved
                s_currentStatus = BallotWorkflowStatus.MeetingEnded;
                emit MeetingEnded();
            } else {
                revert GMBallot__LastProposalStillBeingHandled();
            }
        } else {
            // if not last proposal, go with cycle flow discussion -> voting -> count reveal etc...
            ++s_currentProposalBeingVoted;
            s_currentStatus = BallotWorkflowStatus.ProposalBeingDiscussed;
        }
    }

    function setProposalVotingOpenStatus() external onlyOwner isContractLocked {
        // prior step must definitively be ProposalBeingDiscussed
        if (s_currentStatus != BallotWorkflowStatus.ProposalBeingDiscussed) {
            revert GMBallot__InvalidPeriod();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalVotingOpen;
    }

    function voteForCurrentProposal(uint256 _voteEnum) external customerOnly isContractLocked {
        if (s_currentStatus != BallotWorkflowStatus.ProposalVotingOpen) {
            revert GMBallot__InvalidPeriod();
        }
        if (_voteEnum > uint256(VoteType.Blank)) {
            revert GMBallot__InexistentVoteType();
        }
        if (_checkIfHasAlreadyVoted(s_currentProposalBeingVoted, msg.sender)) {
            revert GMBallot__AlreadyVotedForThisProposal(s_currentProposalBeingVoted, msg.sender);
        }

        VoteType formatedVote = VoteType(_voteEnum);
        Voter memory voter = s_voters[msg.sender];
        if (formatedVote == VoteType.Approval) {
            s_proposals[s_currentProposalBeingVoted].approvals.push(msg.sender);
            s_proposals[s_currentProposalBeingVoted].approvalShares += voter.shares;
        } else if (formatedVote == VoteType.Refusal) {
            s_proposals[s_currentProposalBeingVoted].refusals.push(msg.sender);
            s_proposals[s_currentProposalBeingVoted].refusalShares += voter.shares;
        } else if (formatedVote == VoteType.Blank) {
            s_proposals[s_currentProposalBeingVoted].blankVotes.push(msg.sender);
            s_proposals[s_currentProposalBeingVoted].blankVotesShares += voter.shares;
        }

        s_voters[msg.sender].votedProposalIds.push(s_currentProposalBeingVoted);
    }

    function _checkIfHasAlreadyVoted(uint256 _proposalId, address _customerAddress) internal view returns (bool) {
        uint256 nfOfVotes = s_voters[_customerAddress].votedProposalIds.length;
        if (s_voters[_customerAddress].votedProposalIds.length == 0) {
            return false;
        }
        bool hasAlreadyVoted = false;
        for (uint256 i; i < nfOfVotes; i++) {
            if (s_voters[_customerAddress].votedProposalIds[i] == _proposalId) {
                hasAlreadyVoted = true;
            }
        }

        return hasAlreadyVoted;
    }

    function setCurrentProposalVotingCountReveal() external onlyOwner isContractLocked {
        // prior step must definitively be ProposalBeingDiscussed
        if (s_currentStatus != BallotWorkflowStatus.ProposalVotingOpen) {
            revert GMBallot__InvalidPeriod();
        }

        s_currentStatus = BallotWorkflowStatus.ProposalVotingCountRevealed;
        // calculate result of proposal balot.
        Proposal storage proposal = s_proposals[s_currentProposalBeingVoted];
        if (proposal.refusalShares > 0 || proposal.approvalShares > 0) {
            // if at least one vote for yes or no, then cant be DRAW
            if (proposal.refusalShares > proposal.approvalShares) {
                proposal.votingResult = VotingResult.Refused;
            } else if (proposal.refusalShares < proposal.approvalShares) {
                proposal.votingResult = VotingResult.Approved;
            } else if (proposal.refusalShares == proposal.approvalShares) {
                proposal.votingResult = VotingResult.Draw;
            }
        } else {
            proposal.votingResult = VotingResult.Draw;
        }

        emit ProposalVoteCountBeingRevealed(s_currentProposalBeingVoted);
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE func -> voting 
    //////////////////////////////////////////////////////////////*/
    function lockContract() external onlyOwner {
        // must be MeetingEnded
        if (s_currentProposalBeingVoted == 0 && s_currentStatus != BallotWorkflowStatus.MeetingEnded) {
            revert GMBallot__InvalidPeriod();
        }
        s_currentStatus = BallotWorkflowStatus.ContractLocked;
        emit ContractWasLocked();
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW func
    //////////////////////////////////////////////////////////////*/

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

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return s_proposals[_proposalId];
    }

    function getProposalsComplete() external view returns (ProposalView[] memory) {
        ProposalView[] memory toReturn = new ProposalView[](s_nbOfProposals);
        // prpoposal id start at 1
        if (s_nbOfProposals > 0) {
            for (uint256 id = 1; id < s_nbOfProposals + 1; ++id) {
                // enrich customers who approved
                ProposalView memory tmpProposalView = _buildCompleteProposal(id);
                toReturn[id - 1] = tmpProposalView;
            }
        }

        return toReturn;
    }

    function getProposalCompleteById(uint256 _proposalId) external view returns (ProposalView memory) {
        return _buildCompleteProposal(_proposalId);
    }

    function _buildCompleteProposal(uint256 _proposalId) private view returns (ProposalView memory) {
        MinVoter[] memory tempMinVoterApprovers = new MinVoter[](s_proposals[_proposalId].approvals.length);
        if (s_proposals[_proposalId].approvals.length > 0) {
            for (uint256 j = 0; j < s_proposals[_proposalId].approvals.length; j++) {
                address voterAddress = s_proposals[_proposalId].approvals[j];
                Voter memory tempVoter = s_voters[voterAddress];
                MinVoter memory tempMinVoter = MinVoter({
                    firstName: tempVoter.firstName,
                    lastName: tempVoter.lastName,
                    shares: tempVoter.shares,
                    lotOfficialNumber: tempVoter.lotOfficialNumber
                });
                tempMinVoterApprovers[j] = tempMinVoter;
            }
        }

        MinVoter[] memory tempMinVoterRefused = new MinVoter[](s_proposals[_proposalId].refusals.length);
        if (s_proposals[_proposalId].refusals.length > 0) {
            for (uint256 j = 0; j < s_proposals[_proposalId].refusals.length; j++) {
                address voterAddress = s_proposals[_proposalId].refusals[j];
                Voter memory tempVoter = s_voters[voterAddress];
                MinVoter memory tempMinVoter = MinVoter({
                    firstName: tempVoter.firstName,
                    lastName: tempVoter.lastName,
                    shares: tempVoter.shares,
                    lotOfficialNumber: tempVoter.lotOfficialNumber
                });
                tempMinVoterRefused[j] = tempMinVoter;
            }
        }

        MinVoter[] memory tempMinVoterBlank = new MinVoter[](s_proposals[_proposalId].blankVotes.length);
        if (s_proposals[_proposalId].blankVotes.length > 0) {
            for (uint256 j = 0; j < s_proposals[_proposalId].blankVotes.length; j++) {
                address voterAddress = s_proposals[_proposalId].blankVotes[j];
                Voter memory tempVoter = s_voters[voterAddress];
                MinVoter memory tempMinVoter = MinVoter({
                    firstName: tempVoter.firstName,
                    lastName: tempVoter.lastName,
                    shares: tempVoter.shares,
                    lotOfficialNumber: tempVoter.lotOfficialNumber
                });
                tempMinVoterBlank[j] = tempMinVoter;
            }
        }

        ProposalView memory tmpProposalView = ProposalView({
            id: _proposalId,
            description: s_proposals[_proposalId].description,
            votingResult: s_proposals[_proposalId].votingResult,
            approvals: tempMinVoterApprovers,
            approvalShares: s_proposals[_proposalId].approvalShares,
            refusals: tempMinVoterRefused,
            refusalShares: s_proposals[_proposalId].refusalShares,
            blankVotes: tempMinVoterBlank,
            blankVotesShares: s_proposals[_proposalId].blankVotesShares
        });

        return tmpProposalView;
    }

    function getNbOfProposals() external view returns (uint256) {
        return s_nbOfProposals;
    }

    // COVER WITH TEST
    function getMinimalProposals() external view returns (MinimalProposalView[] memory) {
        MinimalProposalView[] memory toReturn = new MinimalProposalView[](s_nbOfProposals);
        // prpoposal id start at 1
        if (s_nbOfProposals > 0) {
            for (uint256 id = 1; id < s_nbOfProposals + 1; ++id) {
                MinimalProposalView memory tmpProposalView =
                    MinimalProposalView({id: id, description: s_proposals[id].description});
                toReturn[id - 1] = tmpProposalView;
            }
        }

        return toReturn;
    }

    // COVER WITH TEST
    function getMinimalProposal(uint256 _proposalId) external view returns (MinimalProposalView memory) {
        return MinimalProposalView({id: _proposalId, description: s_proposals[_proposalId].description});
    }

    // COVER WITH TEST
    function getVotersOfProposals(uint256 _proposalId) external view returns (address[] memory) {
        Proposal memory proposal = s_proposals[_proposalId];
        address[] memory toReturn =
            new address[](proposal.approvals.length + proposal.refusals.length + proposal.blankVotes.length);
        uint256 arrayIndex;

        if (proposal.approvals.length > 0) {
            for (uint256 index = 0; index < proposal.approvals.length; index++) {
                toReturn[arrayIndex] = proposal.approvals[index];
                arrayIndex++;
            }
        }
        if (proposal.refusals.length > 0) {
            for (uint256 index = 0; index < proposal.refusals.length; index++) {
                toReturn[arrayIndex] = proposal.refusals[index];
                arrayIndex++;
            }
        }
        if (proposal.blankVotes.length > 0) {
            for (uint256 index = 0; index < proposal.blankVotes.length; index++) {
                toReturn[arrayIndex] = proposal.blankVotes[index];
                arrayIndex++;
            }
        }

        return toReturn;
    }
}
