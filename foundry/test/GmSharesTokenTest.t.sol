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
    uint256 public constant INCOMPLETE_TOTAL_SHARES = 499;
    address public constant NOT_REGISTERED = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
    address public constant CUSTOMER1_ADDRESS = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 public constant CUSTOMER1_SHARES = 450;
    address public constant CUSTOMER2_ADDRESS = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    uint256 public constant CUSTOMER2_SHARES = 550;

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

    function test_revert_initialMinting_contractLocked() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        s_token.transfer(CUSTOMER1_ADDRESS, CUSTOMER1_SHARES);
        // will lock contract
        s_token.transfer(CUSTOMER2_ADDRESS, CUSTOMER2_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(GMSharesToken.GMSharesToken__ContractLocked.selector, address(this), TOTAL_SHARES)
        );
        s_token.initialMinting(TOTAL_SHARES);
    }

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

    function test_revert_openTokenizingOfShares_TokenizedSharesMustBeNull() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        s_token.transfer(CUSTOMER1_ADDRESS, INCOMPLETE_TOTAL_SHARES);
        vm.expectRevert(abi.encodeWithSelector(GMSharesToken.GMSharesToken__TokenizedSharesMustBeNull.selector));
        s_token.openTokenizingOfShares();
    }

    function test_suceeds_openTokenizingOfShares() public {
        s_token.initialMinting(TOTAL_SHARES);
        vm.expectEmit(false, false, false, true, address(s_token));
        emit GMSharesToken.TokenizingSharesOpen();
        s_token.openTokenizingOfShares();
        assert(s_token.getGeneralInfo().currentStatus == TokenWorkflowStatus.TransferingShares);
    }

    /*//////////////////////////////////////////////////////////////
                         transfer
    //////////////////////////////////////////////////////////////*/
    function test_revert_transfer_unauthorized() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_token.transfer(NOT_REGISTERED, TOTAL_SHARES);
    }

    function test_revert_transfer_amountExceededTotalSupply() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        vm.expectRevert(
            abi.encodeWithSelector(
                GMSharesToken.GMSharesToken__AmountExceededTotalSupply.selector, NOT_REGISTERED, TOTAL_SHARES + 1
            )
        );
        s_token.transfer(NOT_REGISTERED, TOTAL_SHARES + 1);
    }

    function test_revert_transfer_recipientCantHaveTwoLots() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        s_token.transfer(CUSTOMER1_ADDRESS, INCOMPLETE_TOTAL_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(
                GMSharesToken.GMSharesToken__RecipientCantHaveTwoLots.selector,
                CUSTOMER1_ADDRESS,
                INCOMPLETE_TOTAL_SHARES
            )
        );
        s_token.transfer(CUSTOMER1_ADDRESS, INCOMPLETE_TOTAL_SHARES);
    }

    function test_revert_transfer_mintInitialAmountFirst() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                GMSharesToken.GMSharesToken__MintInitialAmountFirst.selector, NOT_REGISTERED, TOTAL_SHARES
            )
        );
        s_token.transfer(NOT_REGISTERED, TOTAL_SHARES);
    }

    function test_suceeds_transfer() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        s_token.transfer(CUSTOMER1_ADDRESS, CUSTOMER1_SHARES);
        assertEq(s_token.balanceOf(CUSTOMER1_ADDRESS), CUSTOMER1_SHARES);
        assertEq(s_token.balanceOf(address(this)), TOTAL_SHARES - CUSTOMER1_SHARES);
        TokenGeneralInfo memory mainInfo = s_token.getGeneralInfo();
        assertEq(mainInfo.nbOfTokenizedLots, 1);
        assertEq(mainInfo.sharesTokenized, CUSTOMER1_SHARES);
        vm.stopPrank();
    }

    function test_revert_transfer_contractLocked() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        s_token.transfer(CUSTOMER1_ADDRESS, CUSTOMER1_SHARES);
        s_token.transfer(CUSTOMER2_ADDRESS, CUSTOMER2_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(GMSharesToken.GMSharesToken__ContractLocked.selector, NOT_REGISTERED, TOTAL_SHARES)
        );
        s_token.transfer(NOT_REGISTERED, TOTAL_SHARES);
    }

    function test_suceeds_transferAllShares() public {
        s_token.initialMinting(TOTAL_SHARES);
        s_token.openTokenizingOfShares();
        s_token.transfer(CUSTOMER1_ADDRESS, CUSTOMER1_SHARES);
        vm.expectEmit(false, false, false, true, address(s_token));
        emit GMSharesToken.MaxSharesTokenizingReached();
        s_token.transfer(CUSTOMER2_ADDRESS, CUSTOMER2_SHARES);
        assertEq(s_token.balanceOf(CUSTOMER1_ADDRESS), CUSTOMER1_SHARES);
        assertEq(s_token.balanceOf(CUSTOMER2_ADDRESS), CUSTOMER2_SHARES);
        assertEq(s_token.balanceOf(address(this)), 0);
        TokenGeneralInfo memory mainInfo = s_token.getGeneralInfo();
        assertEq(mainInfo.nbOfTokenizedLots, 2);
        assertEq(mainInfo.sharesTokenized, TOTAL_SHARES);
        assert(mainInfo.currentStatus == TokenWorkflowStatus.ContractLocked);
    }
}
