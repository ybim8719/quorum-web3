// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title CondominiumGMFactory
/// @author Pascal Thao
/// @dev Bfsfsefse
/// @notice dedse
contract CondominiumGMFactory is Ownable {
    /*//////////////////////////////////////////////////////////////
                            STRUCTS
    //////////////////////////////////////////////////////////////*/
    struct Customer {
        bool isRegistered;
        string lastName;
        string firstName;
    }

    struct Condominium {
        uint256 id;
        uint256 nbOfLots;
        uint256 totalShares;
        string postalAddress;
        string description;
        CondominiumLot[] lots;
    }

    struct CondominiumLot {
        uint256 id;
        address ownerAddress;
        string lastName;
        string firstName;
        uint256 shares;
    }

    struct GeneralMeeting {}

    /*//////////////////////////////////////////////////////////////
                             ENUMS
    //////////////////////////////////////////////////////////////*/
    enum WorkflowStatus {
        OwnersDecision
    }

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    // event VoterRegistered(address indexed voterAddress);

    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    // error VotingOpti__NotInWhiteList(address unauthorizedVoter);

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    mapping(address customerAddress => Customer customer) private s_customers;
    mapping(address customerAddress => CondominiumLot[]) private s_customersLots;
    Condominium[] private s_condominiumList;

    constructor() Ownable(_msgSender()) {}
    // INTERFACES

    function createCondominium() external {}
    function registerClient() external {}
    function addLotToCondominium() external {}
    function addAdmin() external {}
    function createGMSharesToken() external {}
    function createGM() external {}
    // set to client who is owner of a given lot his token shares (transfer)
    // if is not really owner
    // if gmId is linked to the owner lot and condo
    // if gmId is open
    // if erc status is ok
    // and ERC20 rules
    function assignShares(address customer, uint256 gmId) external {}
    // for a given condo
    function modifyStatus() external {}

    // modifier whitelistedOnly() {
    //     if (s_whiteList[_msgSender()].isRegistered == false) {
    //         revert VotingOpti__NotInWhiteList(_msgSender());
    //     }
    //     _;
    // }

    // modifier isOwnerOrVoter() {
    //     if (_msgSender() != owner() && s_whiteList[_msgSender()].isRegistered == false) {
    //         revert VotingOpti__NotInWhiteList(_msgSender());
    //     }
    //     _;
    // }

    /// @dev override Ownable owner() which is not protected
    // function owner() public view override returns (address) {
    //     if (_msgSender() != super.owner() && s_whiteList[_msgSender()].isRegistered == false) {
    //         revert VotingOpti__StateNotReachable(_msgSender());
    //     }
    //     return super.owner();
    // }

    // receive() external payable {
    //     emit LogDepositReceived(msg.sender);
    // }

    // fallback() external payable {
    //     require(msg.data.length == 0);
    //     emit LogDepositReceived(msg.sender);
    // }
}
