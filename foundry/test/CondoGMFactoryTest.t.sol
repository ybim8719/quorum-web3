// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {CondoGMFactory} from "../src/CondoGMFactory.sol";
import {DeployCondoGMFactory} from "../script/DeployCondoGMFactory.s.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Customer, CondominiumLot, GeneralMeeting, Admin} from "../src/structs/Manager.sol";

contract CondoGMFactoryTest is Test {
    // PROUT

    //https://book.getfoundry.sh/guides/best-practices#internal-functions

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    CondoGMFactory public s_factory;

    /*//////////////////////////////////////////////////////////////
                            MOCK CONSTANTS / constructor
    //////////////////////////////////////////////////////////////*/
    uint256 public constant MAX_ADMIN_NB = 2;
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
    string public constant ADMIN_FIRST_NAME = "JeanMich'";
    string public constant ADMIN_LAST_NAME = "Admin'";
    address public constant ADMIN_ADDRESS = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
    string public constant ADMIN2_FIRST_NAME = "JeanMich2'";
    string public constant ADMIN2_LAST_NAME = "Admin2'";
    address public constant ADMIN2_ADDRESS = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
    string public constant LOT1_OFFICIAL_CODE = "TX023";
    uint256 public constant LOT1_SHARES = 450;
    string public constant LOT2_OFFICIAL_CODE = "PP0023Y";
    uint256 public constant LOT2_SHARES = 550;
    string public constant LOT3_OFFICIAL_CODE = "Coco198";
    uint256 public constant LOT3_SHARES = 600;

    function setUp() public {
        DeployCondoGMFactory script = new DeployCondoGMFactory();
        s_factory = script.run(NAME, DESCRIPTION, POSTAL_ADDRESS, MAX_ADMIN_NB);
    }

    modifier adminAdded() {
        vm.prank(msg.sender);
        s_factory.registeringAdmin(ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_ADDRESS);
        // assertEq(s_factory.getAdmin(0).adminAddress, ADMIN_ADDRESS);
        vm.stopPrank();
        _;
    }

    modifier lotAndCustomerAdded() {
        vm.startPrank(msg.sender);
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        uint256 nbCustomers = s_factory.getCustomersLength();
        assertEq(nbCustomers, 1);
        vm.stopPrank();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                        REGISTERING ADMIN
    //////////////////////////////////////////////////////////////*/
    function test_revert_registerAdmin_alreadyAdded() public {
        vm.startPrank(msg.sender);
        s_factory.registeringAdmin(ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_ADDRESS);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__AdminAlreadyAdded.selector, ADMIN_ADDRESS)
        );
        s_factory.registeringAdmin(ADMIN2_FIRST_NAME, ADMIN2_LAST_NAME, ADMIN_ADDRESS);

        vm.stopPrank();
    }

    function test_revert_registerAdmin_maxSizeReached() public {
        vm.startPrank(msg.sender);
        s_factory.registeringAdmin(ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_ADDRESS);
        s_factory.registeringAdmin(ADMIN2_FIRST_NAME, ADMIN2_LAST_NAME, ADMIN2_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__AdminListFull.selector, NOT_REGISTERED));
        s_factory.registeringAdmin("firstName3", "lastName3", NOT_REGISTERED);
        vm.stopPrank();
    }

    function test_revert_registerAdmin_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, NOT_REGISTERED));
        s_factory.registeringAdmin(ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_ADDRESS);
    }

    /*//////////////////////////////////////////////////////////////
                        REGISTERING CUSTOMER
    //////////////////////////////////////////////////////////////*/
    function test_revert_registerCustomer_alreadyAdded() public {
        vm.startPrank(msg.sender);
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        vm.expectRevert(
            abi.encodeWithSelector(
                CondoGMFactory.CondomGMFactory__CustomerAlreadyRegistered.selector, CUSTOMER1_ADDRESS
            )
        );
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
        vm.stopPrank();
    }

    function test_revert_registerCustomer_zeroAddress() public {
        vm.startPrank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__AddressCantBeZero.selector));
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, address(0));
        vm.stopPrank();
    }

    function test_revert_registerCustomer_emptyStrings() public {
        vm.startPrank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__EmptyString.selector));
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, "", CUSTOMER1_ADDRESS);
        vm.stopPrank();
    }

    function test_revert_registerCustomer_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__Unauthorized.selector, NOT_REGISTERED));
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, "", CUSTOMER1_ADDRESS);
    }

    function test_succeed_registerCustomer_asAdmin() public adminAdded {
        vm.prank(ADMIN_ADDRESS);
        s_factory.registerCustomer(CUSTOMER1_FIRST_NAME, CUSTOMER1_LAST_NAME, CUSTOMER1_ADDRESS);
    }

    // function test_fuzz_registerCustomer(address fuzzedAddress) public {
    //     //     vm.startPrank(msg.sender);
    //     //     s_factory.registerCustomer(fuzzedAddress);
    //     //     CondoGMFactory.Customer memory voter = s_factory.getVoterInfo(fuzzedAddress);
    //     //     assertEq(voter.isRegistered, true);
    //     //     vm.stopPrank();
    // }

    /*//////////////////////////////////////////////////////////////
                        REGISTERING LOT
    //////////////////////////////////////////////////////////////*/
    function test_succeeded_registerLot_completed() public {
        vm.startPrank(msg.sender);
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_factory.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        vm.stopPrank();
        // TODO lot 1 name and code are OK
        // assertEq()
    }

    function test_revert_registerLot_isLocked() public {
        vm.startPrank(msg.sender);
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        s_factory.registerLot(LOT2_OFFICIAL_CODE, LOT2_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__RegisteredLotIsLocked.selector, LOT3_OFFICIAL_CODE)
        );
        s_factory.registerLot(LOT3_OFFICIAL_CODE, LOT3_SHARES);

        vm.stopPrank();
    }

    function test_revert_registerLot_lotAlreadyRegistered() public {
        vm.startPrank(msg.sender);
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__LotAlreadyRegistered.selector, LOT1_OFFICIAL_CODE)
        );
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT2_SHARES);

        vm.stopPrank();
    }

    function test_revert_registerLot_maxSharesOverReached() public {
        vm.startPrank(msg.sender);
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        vm.expectRevert(
            abi.encodeWithSelector(
                CondoGMFactory.CondomGMFactory__TotalSharesExceedsMaxLimit.selector, LOT3_OFFICIAL_CODE
            )
        );
        s_factory.registerLot(LOT3_OFFICIAL_CODE, LOT3_SHARES);

        vm.stopPrank();
    }

    function test_revert_registerLot_unauthorized() public {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__Unauthorized.selector, NOT_REGISTERED));
        s_factory.registerLot(LOT3_OFFICIAL_CODE, LOT3_SHARES);
    }

    function test_succeed_registerLot_asAdmin() public adminAdded {
        vm.prank(ADMIN_ADDRESS);
        s_factory.registerLot(LOT1_OFFICIAL_CODE, LOT1_SHARES);
        // TODO expect lot1 ok
    }

    /*//////////////////////////////////////////////////////////////
                        LINK CUSTOMER TO LOT
    //////////////////////////////////////////////////////////////*/
    // function test_fuzz_submitProposal(string calldata _proposal) public votersRegistered {
    //     vm.assume(bytes(_proposal).length > 0);
    //     vm.startPrank(ACCOUNT1);
    //     s_voting.submitProposal(_proposal);
    //     assertEq(
    //         keccak256(abi.encodePacked(_proposal)), keccak256(abi.encodePacked(s_voting.getProposalInfo(1).description))
    //     );
    //     vm.stopPrank();
    // }
    function test_revert_linkCustomerToLot_unauthorized() public lotAndCustomerAdded {
        vm.prank(NOT_REGISTERED);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__Unauthorized.selector, NOT_REGISTERED));
        s_factory.linkCustomerToLot(CUSTOMER1_ADDRESS, 1);
    }

    function test_revert_linkCustomerToLot_customerNotRegistered() public lotAndCustomerAdded {
        vm.prank(msg.sender);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__CustomerNotFound.selector, CUSTOMER2_ADDRESS)
        );
        s_factory.linkCustomerToLot(CUSTOMER2_ADDRESS, 1);
    }

    function test_revert_linkCustomerToLot_lotIdNotFound() public lotAndCustomerAdded {
        vm.prank(msg.sender);
        vm.expectRevert(abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__LotNotFound.selector, 2));
        s_factory.linkCustomerToLot(CUSTOMER1_ADDRESS, 2);
    }

    function test_revert_linkCustomerToLot_lotAlreadyHasOwner() public lotAndCustomerAdded {
        vm.startPrank(msg.sender);
        s_factory.registerCustomer(CUSTOMER2_FIRST_NAME, CUSTOMER2_LAST_NAME, CUSTOMER2_ADDRESS);
        s_factory.linkCustomerToLot(CUSTOMER1_ADDRESS, 1);
        vm.expectRevert(
            abi.encodeWithSelector(CondoGMFactory.CondomGMFactory__LotAlreadyHasOwner.selector, 1, CUSTOMER2_ADDRESS)
        );
        s_factory.linkCustomerToLot(CUSTOMER2_ADDRESS, 1);
        vm.stopPrank();
    }

    function test_succeed_linkCustomerToLot_asAdmin() public adminAdded lotAndCustomerAdded {
        vm.prank(ADMIN_ADDRESS);
        s_factory.linkCustomerToLot(CUSTOMER1_ADDRESS, 1);
        CondominiumLot memory detail = s_factory.getLotDetail(1);
        assertEq(detail.ownerAddress, CUSTOMER1_ADDRESS);
        assertEq(detail.shares, LOT1_SHARES);
        assertEq(detail.lotOfficalNumber, LOT1_OFFICIAL_CODE);
        CondominiumLot[] memory lots = s_factory.getCustomerLots(CUSTOMER1_ADDRESS);
        assertEq(lots[0].lotOfficalNumber, LOT1_OFFICIAL_CODE);
    }
}
