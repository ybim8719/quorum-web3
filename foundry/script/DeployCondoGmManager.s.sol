// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGmManager} from "../src/CondoGmManager.sol";

contract DeployCondoGmManager is Script {
    CondoGmManager public s_manager;

    function deployApp(
        string memory _name,
        string memory _description,
        string memory _postalAddress,
        uint256 _maxAdminNb
    ) public {
        vm.startBroadcast();
        s_manager = new CondoGmManager(_name, _description, _postalAddress, _maxAdminNb);
        vm.stopBroadcast();
    }

    function run(string memory _name, string memory _description, string memory _postalAddress, uint256 _maxAdminNb)
        external
        returns (CondoGmManager)
    {
        deployApp(_name, _description, _postalAddress, _maxAdminNb);
        return s_manager;
    }
}
