// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGMFactory} from "../src/CondoGMFactory.sol";

contract DeployCondoGMFactory is Script {
    CondoGMFactory public s_condoFactory;

    function deployApp() public {
        vm.startBroadcast();
        s_condoFactory = new CondoGMFactory();
        vm.stopBroadcast();
    }

    function run() external returns (CondoGMFactory) {
        deployApp();
        return s_condoFactory;
    }
}
