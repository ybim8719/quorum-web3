// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {CondoGmManager} from "../src/CondoGmManager.sol";
import {GMSharesToken} from "../src/GmSharesToken.sol";
import {GMBallot} from "../src/GmBallot.sol";
import {DeployCondoGmManagerAndBallot} from "../script/DeployCondoGmManagerAndBallot.s.sol";
import {Customer, Lot, GeneralMeeting} from "../src/structs/Manager.sol";
import {BallotWorkflowStatus, VoteType, Proposal, VotingResult} from "../src/structs/Ballot.sol";
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
    string public constant PROPOSAL1 = "Travaux du sol du couloir batiment B (parties communes)";
    string public constant PROPOSAL2 = "Augmenter de 15% le salaire du gardien";
    uint256 public constant PROPOSAL1_ID = 1;
    uint256 public constant PROPOSAL2_ID = 2;

    function setUp() public {
        DeployCondoGmManagerAndBallot script = new DeployCondoGmManagerAndBallot();
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

    modifier proposalSubmittingIsOpen() {
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
        s_manager.loadSharesAndCustomersToBallot();
        s_ballot.setProposalsSubmittingOpen();
        vm.stopPrank();
        _;
    }

    modifier proposal1BeingDiscussed() {
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
        s_manager.loadSharesAndCustomersToBallot();
        s_ballot.setProposalsSubmittingOpen();
        vm.stopPrank();
        vm.startPrank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        s_ballot.submitProposal(PROPOSAL2);
        vm.stopPrank();
        vm.startPrank(msg.sender);
        s_ballot.setProposalsSubmittingClosed();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.stopPrank();
        _;
    }

    modifier proposal1BeingDiscussedWithTwoSameShares() {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, 500);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, 500);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        s_manager.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT2_ID);
        s_manager.createGMSharesToken();
        s_manager.openTokenizingOfShares();
        s_manager.convertLotSharesToToken(LOT1_ID);
        s_manager.convertLotSharesToToken(LOT2_ID);
        s_manager.loadSharesAndCustomersToBallot();
        s_ballot.setProposalsSubmittingOpen();
        vm.stopPrank();
        vm.startPrank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        s_ballot.submitProposal(PROPOSAL2);
        vm.stopPrank();
        vm.startPrank(msg.sender);
        s_ballot.setProposalsSubmittingClosed();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.stopPrank();
        _;
    }

    modifier ballotLocked() {
        vm.startPrank(msg.sender);
        s_manager.registerLot(LOT1_OFFICIAL_CODE, 500);
        s_manager.registerLot(LOT2_OFFICIAL_CODE, 500);
        s_manager.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        s_manager.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_manager.linkCustomerToLot(CUSTOMER1_ADDRESS, LOT1_ID);
        s_manager.linkCustomerToLot(CUSTOMER2_ADDRESS, LOT2_ID);
        s_manager.createGMSharesToken();
        s_manager.openTokenizingOfShares();
        s_manager.convertLotSharesToToken(LOT1_ID);
        s_manager.convertLotSharesToToken(LOT2_ID);
        s_manager.loadSharesAndCustomersToBallot();
        s_ballot.setProposalsSubmittingOpen();
        vm.stopPrank();
        vm.startPrank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        s_ballot.submitProposal(PROPOSAL2);
        vm.stopPrank();
        vm.startPrank(msg.sender);
        s_ballot.setProposalsSubmittingClosed();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        s_ballot.setProposalVotingOpenStatus();
        vm.stopPrank();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        s_ballot.setProposalVotingOpenStatus();
        vm.stopPrank();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        // end all votes
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        s_ballot.lockContract();
        vm.stopPrank();
        _;
    }

    /*/////////////////////////////////////////////////////////////
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
                    loadSharesAndCustomersToBallot
    //////////////////////////////////////////////////////////////*/
    function test_revert_loadSharesAndCustomersToBallot_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_manager.loadSharesAndCustomersToBallot();
    }

    function test_succeeds_loadSharesAndCustomersToBallot() public tokenLocked {
        vm.prank(msg.sender);
        s_manager.loadSharesAndCustomersToBallot();
        assertEq(s_ballot.getVoter(CUSTOMER1_ADDRESS).tokenVerified, true);
        assertEq(s_ballot.getVoter(CUSTOMER1_ADDRESS).shares, LOT1_SHARES);
        assertEq(s_ballot.getVoter(CUSTOMER2_ADDRESS).tokenVerified, true);
        assertEq(s_ballot.getVoter(CUSTOMER2_ADDRESS).shares, LOT2_SHARES);
    }

    function test_revert_loadSharesAndCustomersToBallot_functionLocked() public tokenLocked {
        vm.startPrank(msg.sender);
        s_manager.loadSharesAndCustomersToBallot();
        vm.expectRevert(abi.encodeWithSelector(CondoGmManager.CondoGmManager__VotersAlreadyImported.selector));
        s_manager.loadSharesAndCustomersToBallot();
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                         setProposalsSubmittingOpen
    //////////////////////////////////////////////////////////////*/
    function test_succeeds_setProposalsSubmittingOpen() public tokenLocked {
        vm.startPrank(msg.sender);
        s_manager.loadSharesAndCustomersToBallot();
        s_ballot.setProposalsSubmittingOpen();
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalsSubmittingOpen);
        vm.stopPrank();
    }

    function test_revert_setProposalsSubmittingOpen_ifInvalidPeriod() public tokenLocked {
        vm.startPrank(msg.sender);
        s_manager.loadSharesAndCustomersToBallot();
        s_ballot.setProposalsSubmittingOpen();
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.setProposalsSubmittingOpen();
        vm.stopPrank();
    }

    function test_revert_setProposalsSubmittingOpen_RegisterVotersFirst() public tokenLocked {
        vm.startPrank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__RegisterVotersFirst.selector));
        s_ballot.setProposalsSubmittingOpen();
        vm.stopPrank();
    }

    function test_revert_setProposalsSubmittingOpen_ballotLocked() public ballotLocked {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__ContractLocked.selector));
        s_ballot.setProposalsSubmittingOpen();
    }
    /*//////////////////////////////////////////////////////////////
                        SUBMIT PROPOSAL
    //////////////////////////////////////////////////////////////*/

    function test_succeeds_submitProposal() public proposalSubmittingIsOpen {
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        assertEq(s_ballot.getProposal(PROPOSAL1_ID).description, PROPOSAL1);
        assertEq(s_ballot.getProposal(PROPOSAL1_ID).refusalShares, 0);
        assertEq(s_ballot.getProposal(PROPOSAL1_ID).approvalShares, 0);
        assertEq(s_ballot.getProposal(PROPOSAL1_ID).refusals.length, 0);
        assertEq(s_ballot.getNextProposalId(), 2);
    }

    function test_revert_submitProposal_unauthorized() public proposalSubmittingIsOpen {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__OnlyCustomerAuthorized.selector, NOT_REGISTERED));
        s_ballot.submitProposal(PROPOSAL1);
    }

    function test_revert_submitProposal_InvalidPeriod() public tokenLocked {
        vm.prank(msg.sender);
        s_manager.loadSharesAndCustomersToBallot();
        vm.prank(CUSTOMER1_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.submitProposal(PROPOSAL1);
    }

    function test_revert_submitProposal_ifDescriptionEmpty() public proposalSubmittingIsOpen {
        vm.prank(CUSTOMER1_ADDRESS);
        vm.expectRevert(GMBallot.GMBallot__DescriptionCantBeEmpty.selector);
        s_ballot.submitProposal("");
    }

    function test_revert_submitProposal_ballotLocked() public ballotLocked {
        vm.prank(CUSTOMER1_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__ContractLocked.selector));
        s_ballot.submitProposal("coucou");
    }

    /*//////////////////////////////////////////////////////////////
                        CLOSE SUBMIT PROPOSAL STATUS
    //////////////////////////////////////////////////////////////*/
    function test_succeeds_setProposalsSubmittingClosed() public proposalSubmittingIsOpen {
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        vm.prank(msg.sender);
        s_ballot.setProposalsSubmittingClosed();
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalsSubmittingClosed);
    }

    function test_revert_setProposalsSubmittingClosed_InvalidPeriod() public tokenLocked {
        vm.prank(msg.sender);
        vm.expectRevert(GMBallot.GMBallot__InvalidPeriod.selector);
        s_ballot.setProposalsSubmittingClosed();
    }

    function test_revert_setProposalsSubmittingClosed_ProposalsAreEmpty() public proposalSubmittingIsOpen {
        vm.prank(msg.sender);
        vm.expectRevert(GMBallot.GMBallot__ProposalsAreEmpty.selector);
        s_ballot.setProposalsSubmittingClosed();
    }

    /*//////////////////////////////////////////////////////////////
                setProposalBeingDiscussedStatusOrEndBallot
    //////////////////////////////////////////////////////////////*/
    function test_succeeds_setProposalBeingDiscussedStatusOrEndBallot() public proposalSubmittingIsOpen {
        vm.startPrank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        s_ballot.submitProposal(PROPOSAL2);
        vm.stopPrank();
        vm.startPrank(msg.sender);
        s_ballot.setProposalsSubmittingClosed();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.stopPrank();
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalBeingDiscussed);
        assertEq(s_ballot.getCurrentProposalBeingVoted(), 1);
    }

    function test_revert_setProposalBeingDiscussedStatusOrEndBallot_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
    }

    function test_revert_setProposalBeingDiscussedStatusOrEndBallot_invalidPeriod() public {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
    }

    function test_revert_setProposalBeingDiscussedStatusOrEndBallot_LastProposalStillBeingHandled()
        public
        proposalSubmittingIsOpen
    {
        vm.startPrank(CUSTOMER1_ADDRESS);
        s_ballot.submitProposal(PROPOSAL1);
        s_ballot.submitProposal(PROPOSAL2);
        vm.stopPrank();
        vm.startPrank(msg.sender);
        s_ballot.setProposalsSubmittingClosed();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__LastProposalStillBeingHandled.selector));
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                    setProposalVotingOpenStatus
    //////////////////////////////////////////////////////////////*/
    function test_succeeds_setProposalVotingOpenStatus() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalVotingOpen);
        assertEq(s_ballot.getCurrentProposalBeingVoted(), 1);
    }

    function test_revert_setProposalVotingOpenStatus_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_ballot.setProposalVotingOpenStatus();
    }

    function test_revert_setProposalVotingOpenStatus_invalidPeriod() public {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.setProposalVotingOpenStatus();
    }

    /*//////////////////////////////////////////////////////////////
                                vote
    //////////////////////////////////////////////////////////////*/
    function test_succeeds_vote_approval() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Pending);
        assertEq(proposal.approvals[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.approvalShares, LOT1_SHARES);
    }

    function test_succeeds_vote_refusal() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Pending);
        assertEq(proposal.refusals[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.refusalShares, LOT1_SHARES);
    }

    function test_succeeds_vote_blank() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Pending);
        assertEq(proposal.blankVotes[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.blankVotesShares, LOT1_SHARES);
    }

    function test_revert_vote_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__OnlyCustomerAuthorized.selector, NOT_REGISTERED));
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
    }

    // function test_revert_vote_ProposalIdNotFound() public proposal1BeingDiscussed {
    //     vm.prank(msg.sender);
    //     s_ballot.setProposalVotingOpenStatus();
    //     vm.prank(CUSTOMER1_ADDRESS);
    //     vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__ProposalIdNotFound.selector, 22));
    //     s_ballot.voteForCurrentProposal(22, uint256(VoteType.Refusal));
    // }

    function test_revert_vote_invalidPeriod() public proposal1BeingDiscussed {
        vm.prank(CUSTOMER1_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
    }

    function test_revert_vote_InexistentVoteType() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InexistentVoteType.selector));
        s_ballot.voteForCurrentProposal(3);
    }

    function test_revert_vote_AlreadyVotedForThisProposal() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
        vm.expectRevert(
            abi.encodeWithSelector(
                GMBallot.GMBallot__AlreadyVotedForThisProposal.selector, PROPOSAL1_ID, CUSTOMER1_ADDRESS
            )
        );
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
    }

    // function test_revert_vote_VotingForWrongProposalId() public proposal1BeingDiscussed {
    //     vm.prank(msg.sender);
    //     s_ballot.setProposalVotingOpenStatus();
    //     vm.prank(CUSTOMER1_ADDRESS);
    //     vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__VotingForWrongProposalId.selector, PROPOSAL2_ID));
    //     s_ballot.voteForCurrentProposal(PROPOSAL2_ID, uint256(VoteType.Refusal));
    // }

    function test_succeeds_vote_twoVoters() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
        vm.prank(CUSTOMER2_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Pending);
        assertEq(proposal.approvals[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.approvals[1], CUSTOMER2_ADDRESS);
        assertEq(proposal.approvalShares, LOT1_SHARES + LOT2_SHARES);
    }

    /*//////////////////////////////////////////////////////////////
                    setProposalVotingCountReveal
    //////////////////////////////////////////////////////////////*/
    function test_revert_setProposalVotingCountReveal_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_ballot.setCurrentProposalVotingCountReveal();
    }

    function test_revert_setProposalVotingCountReveal_invalidPeriod() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.setCurrentProposalVotingCountReveal();
    }

    function test_suceed_setProposalVotingCountReveal_RefusalsWin() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        // customer 1 shares = 450
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
        vm.prank(CUSTOMER2_ADDRESS);
        // customer 2 shares = 550
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
        vm.prank(msg.sender);
        vm.expectEmit(true, false, false, true, address(s_ballot));
        emit GMBallot.ProposalVoteCountBeingRevealed(PROPOSAL1_ID);
        s_ballot.setCurrentProposalVotingCountReveal();
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Refused);
        assertEq(proposal.approvals[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.refusals[0], CUSTOMER2_ADDRESS);
        assertEq(proposal.approvalShares, LOT1_SHARES);
        assertEq(proposal.refusalShares, LOT2_SHARES);
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalVotingCountRevealed);
    }

    function test_suceed_setProposalVotingCountReveal_ApprovalsWin() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        // customer 1 shares = 450
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
        vm.prank(CUSTOMER2_ADDRESS);
        // customer 2 shares = 550
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
        vm.prank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Approved);
        assertEq(proposal.approvals[0], CUSTOMER2_ADDRESS);
        assertEq(proposal.refusals[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.approvalShares, LOT2_SHARES);
        assertEq(proposal.refusalShares, LOT1_SHARES);
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalVotingCountRevealed);
    }

    function test_suceed_setProposalVotingCountReveal_DrawWin1() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        // customer 1 shares = 450
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.prank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Draw);
        assertEq(proposal.blankVotes[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.blankVotesShares, LOT1_SHARES);
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ProposalVotingCountRevealed);
    }

    function test_suceed_setProposalVotingCountReveal_DrawWin2() public proposal1BeingDiscussedWithTwoSameShares {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        // customer 1 shares = 500
        s_ballot.voteForCurrentProposal(uint256(VoteType.Refusal));
        vm.prank(CUSTOMER2_ADDRESS);
        // customer 2 shares = 500
        s_ballot.voteForCurrentProposal(uint256(VoteType.Approval));
        vm.prank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        Proposal memory proposal = s_ballot.getProposal(PROPOSAL1_ID);
        assert(proposal.votingResult == VotingResult.Draw);
        assertEq(proposal.approvals[0], CUSTOMER2_ADDRESS);
        assertEq(proposal.refusals[0], CUSTOMER1_ADDRESS);
        assertEq(proposal.approvalShares, 500);
        assertEq(proposal.refusalShares, 500);
    }

    /*//////////////////////////////////////////////////////////////
         setProposalBeingDiscussedStatusOrEndBallot => end of GM
    //////////////////////////////////////////////////////////////*/
    function test_revert_setProposalBeingDiscussedStatusOrEndBallot_LastProposalStillBeingHandled2()
        public
        proposal1BeingDiscussed
    {
        // 2 proposals
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__LastProposalStillBeingHandled.selector));
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.stopPrank();
    }

    function test_succeeds_setProposalBeingDiscussedStatusOrEndBallot_forBallotsClosure()
        public
        proposal1BeingDiscussed
    {
        // proposal 1 being treated
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        // proposal 2 being treated
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        s_ballot.setProposalVotingOpenStatus();
        vm.stopPrank();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        // end all votes
        vm.expectEmit(false, false, false, true, address(s_ballot));
        emit GMBallot.MeetingEnded();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.stopPrank();
        assert(s_ballot.getProposal(PROPOSAL1_ID).votingResult == VotingResult.Draw);
        assert(s_ballot.getProposal(PROPOSAL2_ID).votingResult == VotingResult.Draw);
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.MeetingEnded);
    }

    /*//////////////////////////////////////////////////////////////
         setProposalBeingDiscussedStatusOrEndBallot => end of GM
    //////////////////////////////////////////////////////////////*/
    function test_revert_lockContract_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_ballot.lockContract();
    }

    function test_revert_lockContract_invalidPeriod() public {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(GMBallot.GMBallot__InvalidPeriod.selector));
        s_ballot.lockContract();
    }

    function test_succeed_lockContract() public proposal1BeingDiscussed {
        vm.prank(msg.sender);
        s_ballot.setProposalVotingOpenStatus();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        s_ballot.setProposalVotingOpenStatus();
        vm.stopPrank();
        vm.prank(CUSTOMER1_ADDRESS);
        s_ballot.voteForCurrentProposal(uint256(VoteType.Blank));
        vm.startPrank(msg.sender);
        s_ballot.setCurrentProposalVotingCountReveal();
        // end all votes
        s_ballot.setProposalBeingDiscussedStatusOrEndBallot();
        vm.expectEmit(false, false, false, true, address(s_ballot));
        emit GMBallot.ContractWasLocked();
        s_ballot.lockContract();
        vm.stopPrank();
        assert(s_ballot.getCurrentStatus() == BallotWorkflowStatus.ContractLocked);
    }
}
