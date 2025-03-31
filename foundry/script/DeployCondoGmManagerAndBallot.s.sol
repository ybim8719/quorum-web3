// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGmManager} from "../src/CondoGmManager.sol";
import {GMBallot} from "../src/GmBallot.sol";

contract DeployCondoGmManagerAndBallot is Script {
    CondoGmManager public s_manager;
    GMBallot public s_ballot;

    function run() external returns (CondoGmManager, GMBallot) {
        deployApp();
        return (s_manager, s_ballot);
    }

    function deployApp() public {
        vm.startBroadcast();
        s_manager = new CondoGmManager("Copro des cocos", "Une retraite paisible", "rue du soleil levant 223");
        s_ballot = new GMBallot("AGO des copro mai 2025", address(s_manager));
        s_manager.setGMBallotAddress(address(s_ballot));
        vm.stopBroadcast();
    }
}
