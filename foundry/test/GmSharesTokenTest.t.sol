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
                            MOCK CONSTANTS
    //////////////////////////////////////////////////////////////*/
    string public constant SYMBOL = "AGOKEN";
    string public constant NAME = "token de copro";
    uint256 public constant TOTAL_SHARES = 1000;
    uint256 public constant INCOMPLETE_TOTAL_SHARES = 999;
    address public constant NOT_REGISTERED = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;

    function setUp() public {
        s_token = new GMSharesToken(NAME, SYMBOL, TOTAL_SHARES);
    }

    /*//////////////////////////////////////////////////////////////
                         initialMinting
    //////////////////////////////////////////////////////////////*/
    function test_revert_initialMinting_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_token.initialMinting(TOTAL_SHARES);
    }

    function test_revert_initialMinting_invalidInitialMintingAmount() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                GMSharesToken.GMSharesToken__InvalidInitialMintingAmount.selector, INCOMPLETE_TOTAL_SHARES
            )
        );
        s_token.initialMinting(INCOMPLETE_TOTAL_SHARES);
    }

    function test_revert_initialMinting_initialMintingDone() public {
        s_token.initialMinting(TOTAL_SHARES);
        vm.expectRevert(abi.encodeWithSelector(GMSharesToken.GMSharesToken__InitialMintingDone.selector, TOTAL_SHARES));
        s_token.initialMinting(TOTAL_SHARES);
    }

    // 1 case revert TODO WHEN LOCKED BY TRANSFER OF ALL SHARES
    //             if (s_currentStatus == TokenWorkflowStatus.ContractLocked) {
    //             revert GMSharesToken__ContractLocked(msg.sender, amount);
    //         }
    // GMSharesToken__ContractLocked(msg.sender, amount);

    function test_succeeds_initialMinting() public {
        s_token.initialMinting(TOTAL_SHARES);
        TokenGeneralInfo memory mainInfo = s_token.getGeneralInfo();
        assertEq(mainInfo.nbOfTokenizedLots, 0);
        assertEq(mainInfo.sharesTokenized, 0);
        assertEq(s_token.balanceOf(address(this)), TOTAL_SHARES);
        assertEq(s_token.totalSupply(), TOTAL_SHARES);
    }

    /*//////////////////////////////////////////////////////////////
                         openTokenizingOfShares
    //////////////////////////////////////////////////////////////*/
    function test_revert_openTokenizingOfShares_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_token.openTokenizingOfShares();
    }

    function test_revert_openTokenizingOfShares_ifInvalidPeriod() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        vm.expectRevert(abi.encodeWithSelector(GMSharesToken.GMSharesToken__InvalidPeriod.selector));
        s_token.openTokenizingOfShares();
    }

    // ??? revert 2 if (s_nbOfTokenizedLots > 0 || s_sharesTokenized > 0) {
    //     revert GMSharesToken__TokenizedSharesMustBeNull();
    // }

    function test_suceeds_openTokenizingOfShares() public {
        s_token.initialMinting(TOTAL_SHARES);
        vm.expectEmit(false, false, false, true, address(s_token));
        emit GMSharesToken.TokenizingSharesOpen();
        s_token.openTokenizingOfShares();
        assert(s_token.getGeneralInfo().currentStatus == TokenWorkflowStatus.TransferingShares);
    }

    /*//////////////////////////////////////////////////////////////
                         openTokenizingOfShares
    //////////////////////////////////////////////////////////////*/

    // 1 revert unauthorized

    //   2 revert ) if (value > i_condoTotalShares) {
    //         // todo 1001 > 1000 caca
    //     }

    //     3) if (s_currentStatus == TokenWorkflowStatus.ContractLocked) {
    //         revert GMSharesToken__ContractLocked(to, value);
    //     }
    //     4) if (s_currentStatus == TokenWorkflowStatus.InitialMinting) {
    //         revert GMSharesToken__MintInitialAmountFirst(to, value);
    //     }
    //     5) if (balanceOf(to) > 0) {
    //         revert GMSharesToken__RecipientCantHaveTwoLots(to, value);
    //     }

    function test_revert_convertSharesToToken() public {
        vm.startPrank(msg.sender);
        // assertEq(GMSharesToken(s_manager.getERC20Address()).balanceOf(lot.customerAddress), lot.shares);
        // TokenGeneralInfo memory info = GMSharesToken(s_manager.getERC20Address()).getGeneralInfo();
        // assertEq(info.sharesTokenized, lot.shares);

        vm.stopPrank();
    }
}
