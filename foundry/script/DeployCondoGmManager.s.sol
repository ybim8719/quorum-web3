// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGmManager} from "../src/CondoGmManager.sol";

contract DeployCondoGmManager is Script {
    CondoGmManager public s_manager;

    function run() external returns (CondoGmManager) {
        deployApp("Villa des ouaouah", "Une petite copro sur l'eau", "33 rue miaou");
        return s_manager;
    }

    function deployApp(string memory _name, string memory _description, string memory _postalAddress) public {
        vm.startBroadcast();
        s_manager = new CondoGmManager(_name, _description, _postalAddress);
        vm.stopBroadcast();
    }
}
