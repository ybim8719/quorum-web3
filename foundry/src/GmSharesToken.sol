// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenWorkflowStatus} from "./structs/Token.sol";

/**
 * @notice ERC20 based token designed to store 1000 shares from a condo
 * @dev inherits OZ erc20 and ownable
 *
 */
contract GMSharesToken is ERC20, Ownable {
    /*//////////////////////////////////////////////////////////////
                        STATES
    //////////////////////////////////////////////////////////////*/
    TokenWorkflowStatus s_currentStatus;
    uint256 s_sharesTokenized;
    uint256 i_maxShares;
    uint256 s_nbOfLots;
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
    error GMSharesToken__InitialMintingDone(address to, uint256 amount);
    error GMSharesToken__InvalidMintingRecipient(address to, uint256 amount);

    //the deployer is the owner of the contract
    constructor(string memory _name, string memory _symbol, uint256 _maxShares, address _managerContract)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        i_maxShares = _maxShares;
        i_managerContract = _managerContract;
    }

    /// @dev initial minting can be applied once.
    function initialMinting(address account, uint256 amount) external onlyOwner {
        if (s_currentStatus == TokenWorkflowStatus.TokenLocked) {
            revert GMSharesToken__ContractLocked(account, amount);
        }

        if (s_currentStatus == TokenWorkflowStatus.TransferingShares) {
            revert GMSharesToken__InitialMintingDone(account, amount);
        }
        // Intial minting needs amount to be equal to total nb of shares of the condo total
        if (account != i_maxShares) {
            revert GMSharesToken__ContractLocked(account, amount);
        }

        //initial minting is for owner balance only
        if (account != owner()) {
            revert GMSharesToken__InvalidMintingRecipient(account, amount);
        }
        // min nb of tokens and transfer all to owner
        _mint(account, amount);
        // open transfering share period
        s_currentStatus = TokenWorkflowStatus.TransferingShares;
    }

    /// @dev overide parent transfert with control of max 1000 and is owner.
    function transfer(address to, uint256 value) public override onlyOwner returns (bool) {
        if (s_currentStatus == TokenWorkflowStatus.TokenLocked) {
            revert GMSharesToken__ContractLocked(to, value);
        }
        if (balanceOf(to) > 0) {
            revert GMSharesToken__RecipientCantHaveTwoLots(to, value);
        }
        // todo réfléchir à d'autres cas de merde avec des address 0 etc...

        bool response = super.transfer(to, value);
        if (response) {
            s_sharesTokenized += value;
            ++s_nbOfLots;
        }
    }
}
