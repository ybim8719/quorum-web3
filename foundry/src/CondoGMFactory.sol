// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title CondominiumGMFactory
/// @author Pascal Thao
/// @dev Bfsfsefse
/// @notice dedse
contract CondomGMFactory is Ownable {
    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    event CondiminiumCreated(uint256 indexed condoId);
    event CustomerCreated(address customerAddress);

    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    error CondomGMFactory__NotACustomer(address unauthorizedVoter);
    error CondomGMFactory__NotAnAdmin(address unauthorizedVoter);

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    address[] private s_customers;
    mapping(address customerAddress => Customer customer) private s_customersInfo;
    Condominium[] private s_condominiumList;

    constructor() Ownable(_msgSender()) {}
    // WRITE  INTERFACES

    /// @dev add a new condo with minimal description
    function createCondominium(string calldata _postalAddress, string calldata _description) external {
        Condominium memory newCondo;
        newCondo.id = 1;
        newCondo.totalShares = 1000;
        newCondo.postalAddress = _postalAddress;
        newCondo.description = _description;
        s_condominiumList.push(newCondo);
        emit CondiminiumCreated(newCondo.id);
    }

    /// @dev add a new customer (owner) to admin db
    function registerCustomer(string calldata _firstName, string calldata _lastName, address _customerAddress)
        external
    {
        // TODO require customer doesnt already exist
        // TODO first and lastname cant be empty string
        // TODO address can be zero address
        s_customers.push(_customerAddress);
        Customer memory newCustomer;
        newCustomer.lastName = _lastName;
        newCustomer.firstName = _firstName;
        newCustomer.isRegistered = true;
        s_customersInfo[_customerAddress] = newCustomer;
        emit CustomerCreated(_customerAddress);
    }

    // todo remove customer

    function addLotToCondominium(uint256 shares, uint256 condoId) external {
        // total must exceed 1000
    }
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

    // VIEW  INTERFACES
    // get all condos
    // get condomium lots of a given condo
    // get full list of clients address and names
    // get lots of a client
    //

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
