// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {CondoGMFactory} from "../src/CondoGMFactory.sol";
import {DeployCondoGMFactory} from "../script/DeployCondoGMFactory.s.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CondoGMFactoryTest is Test {
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    CondoGMFactory public s_factory;

    /*//////////////////////////////////////////////////////////////
                            MOCK CONSTANTS
    //////////////////////////////////////////////////////////////*/
    address public constant ACCOUNT1 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public constant ACCOUNT2 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public constant ACCOUNT3 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    address public constant NOT_REGISTERED = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;

    string public constant DESCRIPTION = "Une villa cossue plein de gens qui jouent au polo";
    string public constant NAME = "Le refuge des nantis";
    string public constant POSTAL_ADDRESS = "15 rue de l'ISF, Puteaux";

    function setUp() public {
        DeployCondoGMFactory script = new DeployCondoGMFactory();
        s_factory = script.run(NAME, DESCRIPTION, POSTAL_ADDRESS);
    }

    // modifier votersRegistered() {
    //     vm.startPrank(msg.sender);
    //     vm.expectEmit(true, false, false, true, address(s_voting));
    //     emit VotingOpti.VoterRegistered(ACCOUNT1);

    //     assertEq(s_voting.isRegistered(ACCOUNT1), true);
    //     assert(s_voting.getCurrentStatus() == VotingOpti.WorkflowStatus.ProposalsRegistrationStarted);
    //     vm.stopPrank();
    //     _;
    // }

    /*//////////////////////////////////////////////////////////////
                        REGISTERING ADMIN
    //////////////////////////////////////////////////////////////*/
    function test_revert_registerAdmin_alreadyAdded() public {}
    function test_revert_registerAdmin_maxSizeReached() public {}

    /*//////////////////////////////////////////////////////////////
                        REGISTERING CUSTOMER
    //////////////////////////////////////////////////////////////*/
    function test_revert_registerCustomer_alreadyAdded() public {}
    function test_revert_registerCustomer_zeroAddress() public {}
    function test_revert_registerCustomer_emptyStrings() public {}

    function test_fuzz_registerCustomer(address fuzzedAddress) public {
        //     vm.startPrank(msg.sender);
        //     s_factory.registerVoter(fuzzedAddress);
        //     CondoGMFactory.Customer memory voter = s_voting.getVoterInfo(fuzzedAddress);
        //     assertEq(voter.isRegistered, true);
        //     vm.stopPrank();
    }
    /*//////////////////////////////////////////////////////////////
                        REGISTERING CUSTOMER
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

    // function testOpti_revert_vote_ifNotRegistered() public proposalsSubmittedAndEnded {
    //     vm.prank(NOT_REGISTERED);
    //     vm.expectRevert(abi.encodeWithSelector(VotingOpti.VotingOpti__NotInWhiteList.selector, NOT_REGISTERED));
    //     s_voting.vote(PROPOSAL_ID1);
    // }
}
