// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {CondoGmManager} from "../src/CondoGmManager.sol";
import {GMSharesToken} from "../src/GmSharesToken.sol";
import {GMBallot} from "../src/GmBallot.sol";
import {DeployCondoGmManager} from "../script/DeployCondoGmManager.s.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Customer, Lot, GeneralMeeting} from "../src/structs/Manager.sol";
import {TokenGeneralInfo, TokenWorkflowStatus} from "../src/structs/Token.sol";

contract CondoGmManagerTest is Test {
    //https://book.getfoundry.sh/guides/best-practices#internal-functions
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    CondoGmManager public s_manager;
    GMBallot public s_ballot;

    /*//////////////////////////////////////////////////////////////
                            MOCK CONSTANTS / constructor
    //////////////////////////////////////////////////////////////*/
    string public constant DESCRIPTION = "Une villa cossue pleine de gens qui jouent au polo";
    string public constant NAME = "Le refuge des nantis";
    string public constant POSTAL_ADDRESS = "15 rue de l'ISF, Puteaux";
    /*//////////////////////////////////////////////////////////////
                            MOCK CONSTANTS / states
    //////////////////////////////////////////////////////////////*/
    string public constant CUSTOMER1_FIRST_NAME = "Thierry";
    string public constant CUSTOMER1_LAST_NAME = "Henri'";
    address public constant CUSTOMER1_ADDRESS = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    string public constant CUSTOMER2_FIRST_NAME = "Ulrich";
    string public constant CUSTOMER2_LAST_NAME = unicode"Ramé'";
    address public constant CUSTOMER2_ADDRESS = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public constant NOT_REGISTERED = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
    string public constant LOT1_OFFICIAL_CODE = "TX023";
    uint256 public constant LOT1_SHARES = 450;
    uint256 public constant LOT1_ID = 1;
    string public constant LOT2_OFFICIAL_CODE = "PP0023Y";
    uint256 public constant LOT2_SHARES = 550;
    uint256 public constant LOT2_ID = 2;
    string public constant LOT3_OFFICIAL_CODE = "Coco198";
    uint256 public constant LOT3_SHARES = 600;

    function setUp() public {
        DeployCondoGmManager script = new DeployCondoGmManager();
        (s_manager, s_ballot) = script.run();
    }

    modifier lotAndCustomerAdded() {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        uint256 nbCustomers = s_manager.getNbOfCustomers();
        assertEq(nbCustomers, 1);
        assertEq(s_manager.getLotsInfos()[0].lastName, "");
        assertEq(s_manager.getLotsInfos()[0].shares, LOT1_SHARES);
        vm.stopPrank();
        _;
    }

    modifier lotsAndCustomersAddedAndLinked() {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        s_manager.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT2_ID);
        vm.stopPrank();
        _;
    }

    modifier tokenLocked() {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        s_manager.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT2_ID);
        s_manager.createGMSharesToken();
        s_manager.openTokenizingOfShares();
        s_manager.convertLotSharesToToken(LOT1_ID);
        s_manager.convertLotSharesToToken(LOT2_ID);
        vm.stopPrank();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                        CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    function test_succeeds_contractInitialzed() public view {
        assertEq(s_manager.getGeneralInfos().condoName, NAME);
        assertEq(s_manager.getGeneralInfos().postalAddress, POSTAL_ADDRESS);
        assertEq(s_manager.getGeneralInfos().description, DESCRIPTION);
    }
    /*//////////////////////////////////////////////////////////////
                        REGISTERING CUSTOMER
    //////////////////////////////////////////////////////////////*/

    function test_revert_registerCustomer_alreadyAdded() public {
        vm.startPrank(msg.sender);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__CustomerAlreadyRegistered.selector, CUSTOMER1_ADDRESS)
        );
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        vm.stopPrank();
    }

    function test_revert_registerCustomer_zeroAddress() public {
        vm.startPrank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__AddressCantBeZero.selector));
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, address(0));
        vm.stopPrank();
    }

    function test_revert_registerCustomer_emptyStrings() public {
        vm.startPrank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__EmptyString.selector));
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, "", CUSTOMER1_ADDRESS);
        vm.stopPrank();
    }

    function test_revert_registerCustomer_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, "", CUSTOMER1_ADDRESS);
    }

    function test_succeed_registerCustomer() public {
        vm.prank(msg.sender);
        vm.expectEmit(true, true, true, true, address(s_manager));
        emit CondoGmManager.CustomerCreated(CUSTOMER1_ADDRESS, CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        assertEq(s_manager.getCustomersList()[0], CUSTOMER1_ADDRESS);
        assertEq(s_manager.getCustomersInfos()[0].lastName, CUSTOMER1_LAST_NAME);
    }

    function test_fuzz_registerCustomer(address _fuzzedAddress) public {
        vm.startPrank(msg.sender);
        // if fuzz sends zero address
        if (_fuzzedAddress == address(0)) {
            vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__AddressCantBeZero.selector));
            s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, _fuzzedAddress);
        } else {
            s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, _fuzzedAddress);
            Customer memory customer = s_manager.getCustomerDetail(_fuzzedAddress);
            assertEq(customer.isRegistered, true);
            assertEq(customer.firstName, CUSTOMER1_FIRST_NAME);
            assertEq(customer.lastName, CUSTOMER1_LAST_NAME);
            vm.stopPrank();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        REGISTERING LOT
    //////////////////////////////////////////////////////////////*/
    function test_succeeded_registerLot_completed() public {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        vm.expectEmit(false, false, false, true, address(s_manager));
        emit CondoGmManager.TotalSharesReachedMaxLimit();
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        vm.stopPrank();
        assertEq(s_manager.getLotById(LOT1_ID).shares, LOT1_SHARES);
        assertEq(s_manager.getLotById(LOT2_ID).lotOfficialNumber, LOT2_OFFICIAL_CODE);
        assertEq(s_manager.getAddingLotIsLocked(), true);
    }

    function test_revert_registerLot_shareCantBeZero() public {
        vm.prank(msg.sender);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__SharesCantBeZero.selector, LOT1_OFFICIAL_CODE)
        );
        s_manager.registerLot(LOT1_OFFICIAL_CODE, 0);
    }

    // TODO UN JOUR
    // function test_fuzz_registerLot(string calldata _lotOfficialNumber, uint256 _shares) public {
    //     vm.assume(_shares < 1000);
    //     vm.startPrank(msg.sender);

    //     if (bytes(_lotOfficialNumber).length == 0) {
    //         vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__EmptyString.selector));
    //         s_manager.registerLot(_lotOfficialNumber, _shares);
    //     } else {
    //         s_manager.registerLot(_lotOfficialNumber, _shares);
    //         assertEq(s_manager.getLotById(LOT1_ID).shares, _shares);
    //         assertEq(s_manager.getLotById(LOT1_ID).lotOfficialNumber, _lotOfficialNumber);
    //     }
    //     vm.stopPrank();
    // }

    function test_revert_registerLot_isLocked() public {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__RegisteredLotIsLocked.selector, LOT3_OFFICIAL_CODE)
        );
        s_manager.registerLot(LOT3_OFFICIAL_CODE, LOT3_SHARES);

        vm.stopPrank();
    }

    function test_revert_registerLot_lotAlreadyRegistered() public {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__LotAlreadyRegistered.selector, LOT1_OFFICIAL_CODE)
        );
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT2_SHARES);

        vm.stopPrank();
    }

    function test_revert_registerLot_maxSharesOverReached() public {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(
                CondoGmManager.CondoGmManager__TotalSharesExceedsMaxLimit.selector, LOT3_OFFICIAL_CODE
            )
        );
        s_manager.registerLot(LOT3_OFFICIAL_CODE, LOT3_SHARES);

        vm.stopPrank();
    }

    function test_revert_registerLot_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_manager.registerLot(LOT3_OFFICIAL_CODE, LOT3_SHARES);
    }

    function test_succeed_registerLot() public {
        vm.prank(msg.sender);
        vm.expectEmit(true, false, false, true, address(s_manager));
        emit CondoGmManager.LotAdded(LOT1_OFFICIAL_CODE);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
    }

    /*//////////////////////////////////////////////////////////////
                        LINK CUSTOMER TO LOT
    //////////////////////////////////////////////////////////////*/
    function test_revert_linkCustomerToLot_unauthorized() public lotAndCustomerAdded {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
    }

    function test_revert_linkCustomerToLot_customerNotRegistered() public lotAndCustomerAdded {
        vm.prank(msg.sender);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__CustomerNotFound.selector, CUSTOMER2_ADDRESS)
        );
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT1_ID);
    }

    function test_revert_linkCustomerToLot_lotIdNotFound() public lotAndCustomerAdded {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__LotNotFound.selector, 2));
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, 2);
    }

    function test_revert_linkCustomerToLot_lotAlreadyHasOwner() public lotAndCustomerAdded {
        vm.startPrank(msg.sender);
        s_manager.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__LotAlreadyHasOwner.selector, 1, CUSTOMER2_ADDRESS)
        );
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT1_ID);
        vm.stopPrank();
    }

    function test_revert_linkCustomerToLot_customerCantHaveTwoLots() public lotAndCustomerAdded {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__CustomerHasAlreadyLot.selector, CUSTOMER1_ADDRESS)
        );
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT2_ID);
        vm.stopPrank();
    }

    function test_succeeds_linkCustomerToLot() public lotAndCustomerAdded {
        vm.prank(msg.sender);
        vm.expectEmit(true, true, false, true, address(s_manager));
        emit CondoGmManager.CustomerOfLotSet(LOT1_ID, CUSTOMER1_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        Lot memory detail = s_manager.getLotById(LOT1_ID);
        assertEq(detail.customerAddress, CUSTOMER1_ADDRESS);
        assertEq(detail.shares, LOT1_SHARES);
        assertEq(detail.lotOfficialNumber, LOT1_OFFICIAL_CODE);
        Customer memory customer = s_manager.getCustomerDetail(CUSTOMER1_ADDRESS);
        assertEq(customer.lotId, LOT1_ID);
    }

    function test_succeeds_ERC20Checking_returnsFalseIf1000NotReached() public lotAndCustomerAdded {
        vm.startPrank(msg.sender);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        assertEq(s_manager.getAddingLotIsLocked(), false);
        assertEq(s_manager.getsDeployERC20IsPossible(), false);
        vm.stopPrank();
    }

    function test_succeeds_ERC20Checking_returnsFalseIfNotAllLotsLinked() public lotAndCustomerAdded {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        assertEq(s_manager.getAddingLotIsLocked(), true);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        assertEq(s_manager.getsDeployERC20IsPossible(), false);
        vm.stopPrank();
    }

    function test_succeeds_ERC20Checking_returnsTrue() public lotAndCustomerAdded {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        assertEq(s_manager.getAddingLotIsLocked(), true);
        s_manager.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT2_ID);
        assertEq(s_manager.getsDeployERC20IsPossible(), true);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                        createGMSharesToken
    //////////////////////////////////////////////////////////////*/
    function test_succeed_createGMSharesToken() public lotsAndCustomersAddedAndLinked {
        vm.prank(msg.sender);
        s_manager.createGMSharesToken();
        assertNotEq(s_manager.getERC20Address(), address(0));
        assertEq(GMSharesToken(s_manager.getERC20Address()).balanceOf(address(s_manager)), 1000);
    }

    function test_revert_createGMSharesToken_alreadyDeployed() public lotsAndCustomersAddedAndLinked {
        vm.startPrank(msg.sender);
        s_manager.createGMSharesToken();
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__CantDeployAnotherERC20.selector));
        s_manager.createGMSharesToken();
        vm.stopPrank();
    }

    function test_revert_createGMSharesToken_unauthorized() public lotsAndCustomersAddedAndLinked {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_manager.createGMSharesToken();
    }

    function test_revert_createGMSharesToken_invalidConditions() public {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__DeployERC20ConditionsNotReached.selector));
        s_manager.createGMSharesToken();
    }

    /*//////////////////////////////////////////////////////////////
                       openTokenizingOfShares
    //////////////////////////////////////////////////////////////*/
    function test_revert_openTokenizingOfShares_ifERC20NotDeployedYet() public lotsAndCustomersAddedAndLinked {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__ERC20NotDeployedYet.selector));
        s_manager.openTokenizingOfShares();
    }

    function test_revert_openTokenizingOfShares_ifUnauthorized() public lotsAndCustomersAddedAndLinked {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_manager.openTokenizingOfShares();
    }

    /*//////////////////////////////////////////////////////////////
                       convertSharesToToken
    //////////////////////////////////////////////////////////////*/
    function test_revert_convertSharesToToken_ifERC20NotDeployedYet() public lotsAndCustomersAddedAndLinked {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__ERC20NotDeployedYet.selector));
        s_manager.convertLotSharesToToken(LOT1_ID);
    }

    function test_revert_convertSharesToToken_ifLotSharesAlreadyTokenized() public lotsAndCustomersAddedAndLinked {
        vm.startPrank(msg.sender);
        s_manager.createGMSharesToken();
        s_manager.openTokenizingOfShares();
        s_manager.convertLotSharesToToken(LOT1_ID);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGmManager.CondoGmManager__LotSharesAlreadyTokenized.selector, LOT1_ID)
        );
        s_manager.convertLotSharesToToken(LOT1_ID);
        vm.stopPrank();
    }

    function test_succeeds_convertSharesToToken() public lotsAndCustomersAddedAndLinked {
        vm.startPrank(msg.sender);
        s_manager.createGMSharesToken();
        s_manager.openTokenizingOfShares();
        s_manager.convertLotSharesToToken(LOT1_ID);
        Lot memory lot = s_manager.getLotById(LOT1_ID);
        assertEq(lot.isTokenized, true);
        assertEq(GMSharesToken(s_manager.getERC20Address()).balanceOf(lot.customerAddress), lot.shares);
        TokenGeneralInfo memory info = GMSharesToken(s_manager.getERC20Address()).getGeneralInfo();
        assertEq(info.sharesTokenized, lot.shares);
        assertEq(info.nbOfTokenizedLots, 1);
        assert(info.currentStatus == TokenWorkflowStatus.TransferingShares);
        vm.stopPrank();
    }

    function test_succeeds_convertAllSharesToToken() public lotsAndCustomersAddedAndLinked {
        vm.startPrank(msg.sender);
        s_manager.createGMSharesToken();
        s_manager.openTokenizingOfShares();
        s_manager.convertLotSharesToToken(LOT1_ID);
        vm.expectEmit(false, false, false, true, address(s_manager.getERC20Address()));
        emit GMSharesToken.MaxSharesTokenizingReached();
        s_manager.convertLotSharesToToken(LOT2_ID);
        TokenGeneralInfo memory info = GMSharesToken(s_manager.getERC20Address()).getGeneralInfo();
        assert(info.currentStatus == TokenWorkflowStatus.ContractLocked);
        assertEq(info.sharesTokenized, LOT2_SHARES + LOT1_SHARES);
        assertEq(info.nbOfTokenizedLots, 2);
        // TEST THIS
        assertEq(s_manager.getERC20isLocked(), true);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                         create BALLOT
    //////////////////////////////////////////////////////////////*/
    // function test_revert_unauthorized() public {
    //     vm.prank(NOT_REGISTERED);
    //     vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
    //     s_manager.createGMBallot();
    // }
    /*//////////////////////////////////////////////////////////////
                         other
    //////////////////////////////////////////////////////////////*/
}
