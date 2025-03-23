// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TokenWorkflowStatus} from "./structs/Token.sol";

/**
 * @notice ultra basic ERC20 based token
 */
contract GMSharesToken is ERC20, Ownable {
    TokenWorkflowStatus s_currentStatus;
    uint256 s_sharesTokenized;
    uint256 s_maxShares;

    event Share();

    error GMSharesToken__MintingLocked(address account, uint256 amount);

    //the deployer is the owner of the contract
    constructor(string memory _name, string memory _symbol, uint256 _maxShares)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        s_maxShares = _maxShares;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        if (s_currentStatus != TokenWorkflowStatus.InitialMinting) {
            revert GMSharesToken__MintingLocked(account, amount);
        }
        // if total doesnt exceed
        _mint(account, amount);
    }

    // overide parent transfert with control of max 1000 and is owner.
    function transfer() external onlyOwner {}
}
