// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGMFactory} from "../src/CondoGMFactory.sol";

contract DeployCondoGMFactory is Script {
    CondoGMFactory public s_condoFactory;

    function deployApp(string memory _name, string memory _description, string memory _postalAddress) public {
        vm.startBroadcast();
        s_condoFactory = new CondoGMFactory(_name, _description, _postalAddress);
        vm.stopBroadcast();
    }

    function run(string memory _name, string memory _description, string memory _postalAddress)
        external
        returns (CondoGMFactory)
    {
        deployApp(_name, _description, _postalAddress);
        return s_condoFactory;
    }
}
