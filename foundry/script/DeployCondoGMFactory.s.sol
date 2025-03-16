// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGMFactory} from "../src/CondoGMFactory.sol";

contract DeployCondoGMFactory is Script {
    CondoGMFactory public condo;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        condo = new CondoGMFactory();
        vm.stopBroadcast();
    }
}
