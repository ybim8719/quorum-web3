// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CondoGmManager} from "../src/CondoGmManager.sol";
import {GMBallot} from "../src/GmBallot.sol";

contract DeployCondoGmManagerAndBallot is Script {
    string constant CONDO_TITLE = unicode"La résidence tranquille des cocos cossus";
    string constant CONDO_DESCRIPTION = unicode"Une copropriété de 35 lots située à proximité des Monts d'Arrée";
    string constant CONDO_ADDRESS = "45 rue Fontaine Michalon, 29300 LANGRENEUC-MARIAKER";
    string constant GM_DESCRIPTION = unicode"AGO des propriétés du  6 mai 2025";

    CondoGmManager public s_manager;
    GMBallot public s_ballot;

    function run() external returns (CondoGmManager, GMBallot) {
        deployApp();
        return (s_manager, s_ballot);
    }

    function deployApp() public {
        vm.startBroadcast();
        s_manager = new CondoGmManager(CONDO_TITLE, CONDO_DESCRIPTION, CONDO_ADDRESS);
        s_ballot = new GMBallot(GM_DESCRIPTION, address(s_manager));
        s_manager.setGMBallotAddress(address(s_ballot));
        vm.stopBroadcast();
    }
}
