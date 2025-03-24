// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenWorkflowStatus} from "./structs/Token.sol";

/// @notice ERC20 based token designed to store 1000 shares from a condo for a given generalMeeting
/// Approvals are deactivated for now
/// @dev inherits OpenZep erc20 and ownable
contract GMSharesToken is ERC20, Ownable {
    /*//////////////////////////////////////////////////////////////
                        STATES
    //////////////////////////////////////////////////////////////*/
    TokenWorkflowStatus s_currentStatus;
    uint256 s_sharesTokenized;
    uint256 i_condoTotalShares;
    uint256 s_nbOfTokenizedLots;
    address i_managerContract;

    /*//////////////////////////////////////////////////////////////
                        EVENTS
    //////////////////////////////////////////////////////////////*/
    event ShareTokenized(uint256 lotId, uint256 shares);

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

    /// @notice the deployer is the owner of the contract
    constructor(string memory _name, string memory _symbol, uint256 _condoTotalShares, address _managerContract)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        i_condoTotalShares = _condoTotalShares;
        i_managerContract = _managerContract;
    }

    /// @notice initial minting can be applied once for the entire condo shares
    function initialMinting(uint256 amount) external onlyOwner {
        if (s_currentStatus == TokenWorkflowStatus.ContractLocked) {
            revert GMSharesToken__ContractLocked(msg.sender, amount);
        }

        if (s_currentStatus == TokenWorkflowStatus.TransferingShares) {
            revert GMSharesToken__InitialMintingDone(amount);
        }
        // Intial minting needs amount to be equal to total nb of shares of the condo total
        if (amount != i_condoTotalShares) {
            revert GMSharesToken__InvalidInitialMintingAmount(amount);
        }

        // min nb of tokens and transfer all to owner
        _mint(msg.sender, amount);
        // open transfering share period
        s_currentStatus = TokenWorkflowStatus.TransferingShares;
    }

    /// @dev override parent transfer with strict control related to business rules
    function transfer(address to, uint256 value) public override onlyOwner returns (bool) {
        if (value > i_condoTotalShares) {
            // todo 1001 > 1000 caca
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
            }
        }

        return response;
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getCurrentStatus() external view returns (TokenWorkflowStatus) {
        return s_currentStatus;
    }

    function getCondoTotalShares() external view returns (uint256) {
        return i_condoTotalShares;
    }

    function getNbOfTokenizedLots() external view returns (uint256) {
        return s_nbOfTokenizedLots;
    }

    function getSharesTokenized() external view returns (uint256) {
        return s_sharesTokenized;
    }
}
