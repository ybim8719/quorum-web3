// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenWorkflowStatus, TokenGeneralInfo} from "./structs/Token.sol";
import {console} from "forge-std/Test.sol";
import {GMBallot} from "./GmBallot.sol";

/// @notice ERC20 based token designed to store 1000 shares from a condo for a given generalMeeting
/// Approvals are deactivated for now
/// @dev is owner by manager CONTRACT which will have the only rights to write into this
contract GMSharesToken is ERC20, Ownable {
    // TODO overide and neutralized approvals
    // WHAT ABOUT DECIMALS ?
    /*//////////////////////////////////////////////////////////////
                        STATES
    //////////////////////////////////////////////////////////////*/
    TokenWorkflowStatus s_currentStatus;
    uint256 s_sharesTokenized;
    uint256 i_condoTotalShares;
    uint256 s_nbOfTokenizedLots;
    address i_managerContract;
    address s_deployedBallot;

    /*//////////////////////////////////////////////////////////////
                        EVENTS
    //////////////////////////////////////////////////////////////*/
    event ShareTokenized(uint256 lotId, uint256 shares);
    event TokenizingSharesOpen();
    event MaxSharesTokenizingReached();

    /*//////////////////////////////////////////////////////////////
                        ERRORS
    //////////////////////////////////////////////////////////////*/
    error GMSharesToken__ContractLocked(address account, uint256 amount);
    error GMSharesToken__Cant(address account, uint256 amount);
    error GMSharesToken__RecipientCantHaveTwoLots(address to, uint256 amount);
    error GMSharesToken__InitialMintingDone(uint256 amount);
    error GMSharesToken__InvalidMintingRecipient(address to, uint256 amount);
    error GMSharesToken__InvalidInitialMintingAmount(uint256 amount);
    error GMSharesToken__MintInitialAmountFirst(address to, uint256 amount);
    error GMSharesToken__InvalidPeriod();
    error GMSharesToken__TokenizedSharesMustBeNull();
    error GMSharesToken__AmountExceededTotalSupply(address to, uint256 amount);
    error CondoGmManager__CantDeployAnotherBallot();
    error CondoGmManager__DeployBallotConditionsNotReached();

    /// @notice parent contract (manager) becomes the owner of the contract
    constructor(string memory _name, string memory _symbol, uint256 _condoTotalShares)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        i_condoTotalShares = _condoTotalShares;
    }

    /// @notice initial minting can be applied once for the entire condo shares
    function initialMinting(uint256 amount) external onlyOwner {
        if (s_currentStatus == TokenWorkflowStatus.ContractLocked) {
            revert GMSharesToken__ContractLocked(msg.sender, amount);
        }
        if (totalSupply() == i_condoTotalShares) {
            revert GMSharesToken__InitialMintingDone(amount);
        }
        // Intial minting needs amount to be equal to total nb of shares of the condo total
        if (amount != i_condoTotalShares) {
            revert GMSharesToken__InvalidInitialMintingAmount(amount);
        }
        // min nb of tokens and transfer all to owner
        _mint(msg.sender, amount);
    }

    /// @notice owner must ensure that initial minintg of 1000 was applied before opening shares
    function openTokenizingOfShares() external onlyOwner {
        if (s_nbOfTokenizedLots > 0 || s_sharesTokenized > 0) {
            revert GMSharesToken__TokenizedSharesMustBeNull();
        }
        if (s_currentStatus != TokenWorkflowStatus.InitialMinting) {
            revert GMSharesToken__InvalidPeriod();
        }

        s_currentStatus = TokenWorkflowStatus.TransferingShares;
        emit TokenizingSharesOpen();
    }

    /// @dev override parent transfer with strict control related to business rules
    function transfer(address to, uint256 value) public override onlyOwner returns (bool) {
        if (value > i_condoTotalShares) {
            revert GMSharesToken__AmountExceededTotalSupply(to, value);
        }
        if (s_currentStatus == TokenWorkflowStatus.ContractLocked) {
            revert GMSharesToken__ContractLocked(to, value);
        }
        if (s_currentStatus == TokenWorkflowStatus.InitialMinting) {
            revert GMSharesToken__MintInitialAmountFirst(to, value);
        }
        if (balanceOf(to) > 0) {
            revert GMSharesToken__RecipientCantHaveTwoLots(to, value);
        }
        // todo réfléchir à d'autres cas de merde avec des address 0 etc...

        bool response = super.transfer(to, value);
        if (response) {
            s_sharesTokenized += value;
            ++s_nbOfTokenizedLots;
            if (s_sharesTokenized == s_sharesTokenized && balanceOf(owner()) == 0) {
                // reached 1000 shares tokenized, all initial Supply was transfered to customers addresses
                s_currentStatus = TokenWorkflowStatus.ContractLocked;
                emit MaxSharesTokenizingReached();
            }
        }

        return response;
    }

    /*//////////////////////////////////////////////////////////////
                     WRITE FUNCTIONS -> BALLOT
    //////////////////////////////////////////////////////////////*/
    // function createGMBallot(address owner) external onlyOwner {
    //     if (s_currentStatus != TokenWorkflowStatus.ContractLocked) {
    //         revert CondoGmManager__DeployBallotConditionsNotReached();
    //     }

    //     if (s_deployedBallot != address(0)) {
    //         revert CondoGmManager__CantDeployAnotherBallot();
    //     }
    //     // instantiate BALLOT contract with xxxxxx
    //     GMBallot deployed = new GMBallot("General meeting of june 2025", owner, address(this));
    //     s_deployedBallot = address(deployed);
    // }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getGeneralInfo() external view returns (TokenGeneralInfo memory) {
        return TokenGeneralInfo(i_condoTotalShares, s_nbOfTokenizedLots, s_sharesTokenized, s_currentStatus);
    }

    function getCurrentStatus() external view returns (TokenWorkflowStatus) {
        return s_currentStatus;
    }
}
