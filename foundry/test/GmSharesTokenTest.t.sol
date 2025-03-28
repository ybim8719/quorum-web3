// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {CondoGmManager} from "../src/CondoGmManager.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Customer, Lot, GeneralMeeting} from "../src/structs/Manager.sol";
import {GMSharesToken} from "../src/GmSharesToken.sol";
import {TokenGeneralInfo, TokenWorkflowStatus} from "../src/structs/Token.sol";

contract CondoGmManagerTest is Test {
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    GMSharesToken public s_token;

    /*//////////////////////////////////////////////////////////////
                            MOCK CONSTANTS / constructor
    //////////////////////////////////////////////////////////////*/
    string public constant SYMBOL = "AGOKEN";
    string public constant NAME = "token de copro";
    uint256 public constant SHARES = 1000;

    /*//////////////////////////////////////////////////////////////
                            MOCK CONSTANTS / states
    //////////////////////////////////////////////////////////////*/
    function setUp() public {
        s_token = new GMSharesToken(NAME, SYMBOL, SHARES);
    }

    // transfer
    // REVERT token transfer side
    //    4 ) if (value > i_condoTotalShares) {
    //         // todo 1001 > 1000 caca
    //     }
    //     5) if (s_currentStatus == TokenWorkflowStatus.ContractLocked) {
    //         revert GMSharesToken__ContractLocked(to, value);
    //     }
    //     6) if (s_currentStatus == TokenWorkflowStatus.InitialMinting) {
    //         revert GMSharesToken__MintInitialAmountFirst(to, value);
    //     }
    //     7) if (balanceOf(to) > 0) {
    //         revert GMSharesToken__RecipientCantHaveTwoLots(to, value);
    //     }
}
