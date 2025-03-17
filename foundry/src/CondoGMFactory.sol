// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Customer, CondominiumLot, GeneralMeeting, Admin} from "./structs/Manager.sol";

/// @title CondominiumGMFactory
/// @author Pascal Thao
/// @dev Bfsfsefse
/// @notice dedse

contract CondoGMFactory is Ownable {
    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    event LotAdded(string indexed condoLotId);
    event LotOwnerSet(uint256 indexed lotId, address owner);
    event CustomerCreated(address customerAddress, string firstName, string lastName);
    event AdminRegistered(address adminAddress, string firstName, string lastName);
    event LotsAllRegistered();

    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    error CondomGMFactory__NotACustomer(address unauthorizedVoter);
    error CondomGMFactory__NotAnAdmin(address unauthorizedVoter);
    error CondomGMFactory__Unauthorized(address unauthorizedVoter);
    error CondomGMFactory__CustomerAlreadyRegistered(address customer);
    error CondomGMFactory__EmptyString();
    error CondomGMFactory__AddressCantBeZero();
    error CondomGMFactory__LotAlreadyRegistered(string lotOfficialNumber);
    error CondomGMFactory__TotalSharesExceedsMaxLimit(string lotOfficialNumber);
    error CondomGMFactory__LotAlreadyHasOwner(uint256 lotId, address customerAddress);
    error CondomGMFactory__CustomerNotFound(address customerAddress);
    error CondomGMFactory__LotNotFound(uint256 lotId);
    error CondomGMFactory__RegisteredLotIsLocked(string lotOfficialNumber);

    uint256 private constant SHARES_LIMIT = 1000;
    uint256 private constant ADMIN_NUMBER_LIMIT = 10;

    string i_postalAddress;
    string i_description;
    string i_condoName;

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    Admin[] private s_adminList;
    address[] private s_customers;
    mapping(address customerAddress => Customer customer) private s_customersInfo;
    mapping(uint256 lotId => CondominiumLot lot) private s_condoLotsList;
    mapping(string lotOfficalNumber => bool isRegistered) private s_lotsOfficialNumbers;

    uint256 s_nbOfLots;
    uint256 s_currentTotalShares;
    uint256 s_nextLotIndex;
    bool s_addingLotIsLocked;

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier isAdminOrOwner() {
        if (_msgSender() != owner()) {
            bool isAdmin = false;
            for (uint256 i = 0; i < s_adminList.length; i++) {
                if (s_adminList[i].adminAddress == _msgSender()) {
                    isAdmin = true;
                }
            }
            if (isAdmin) {
                revert CondomGMFactory__Unauthorized(_msgSender());
            }
        }
        _;
    }

    modifier hasAccess() {
        if (s_customersInfo[_msgSender()].isRegistered == false && _msgSender() != owner()) {
            bool isAdmin = false;
            for (uint256 i = 0; i < s_adminList.length; i++) {
                if (s_adminList[i].adminAddress == _msgSender()) {
                    isAdmin = true;
                }
            }
            if (isAdmin) {
                revert CondomGMFactory__Unauthorized(_msgSender());
            }
        }
        _;
    }

    constructor(string memory _name, string memory _description, string memory _postalAddress) Ownable(_msgSender()) {
        s_nextLotIndex = 1;
        i_postalAddress = _postalAddress;
        i_description = _description;
        i_condoName = _name;
    }

    /// @dev add a new customer (owner) to admin db
    function registerCustomer(string calldata _firstName, string calldata _lastName, address _customerAddress)
        external
    {
        if (s_customersInfo[_customerAddress].isRegistered == true) {
            revert CondomGMFactory__CustomerAlreadyRegistered(_customerAddress);
        }
        if (_customerAddress == address(0)) {
            revert CondomGMFactory__AddressCantBeZero();
        }
        if (bytes(_firstName).length == 0 || bytes(_lastName).length == 0) {
            revert CondomGMFactory__EmptyString();
        }

        s_customers.push(_customerAddress);
        Customer memory newCustomer;
        newCustomer.lastName = _lastName;
        newCustomer.firstName = _firstName;
        newCustomer.isRegistered = true;
        s_customersInfo[_customerAddress] = newCustomer;
        emit CustomerCreated(_customerAddress, _firstName, _lastName);
    }

    function registerLot(uint256 _shares, string memory _lotOfficialNumber) external {
        if (s_addingLotIsLocked) {
            revert CondomGMFactory__RegisteredLotIsLocked(_lotOfficialNumber);
        }
        if (s_lotsOfficialNumbers[_lotOfficialNumber]) {
            revert CondomGMFactory__LotAlreadyRegistered(_lotOfficialNumber);
        }
        if (s_currentTotalShares + _shares > SHARES_LIMIT) {
            revert CondomGMFactory__TotalSharesExceedsMaxLimit(_lotOfficialNumber);
        }

        CondominiumLot storage newLot = s_condoLotsList[s_nextLotIndex];
        newLot.shares = _shares;
        newLot.lotOfficalNumber = _lotOfficialNumber;
        s_currentTotalShares += _shares;
        ++s_nbOfLots;
        ++s_nextLotIndex;
        s_lotsOfficialNumbers[_lotOfficialNumber] = true;
        emit LotAdded(_lotOfficialNumber);
        if (s_currentTotalShares == SHARES_LIMIT) {
            s_addingLotIsLocked = true;
            emit LotsAllRegistered();
        }
    }

    function linkCustomerToLot(address _customerAddress, uint256 _lotId) external {
        if (s_condoLotsList[_lotId].ownerAddress != address(0)) {
            revert CondomGMFactory__LotAlreadyHasOwner(_lotId, _customerAddress);
        }

        if (s_customersInfo[_customerAddress].isRegistered == false) {
            // customer must exist in customer list
            revert CondomGMFactory__CustomerNotFound(_customerAddress);
        }

        if (bytes(s_condoLotsList[_lotId].lotOfficalNumber).length == 0) {
            // lot not  be found
            revert CondomGMFactory__LotNotFound(_lotId);
        }

        CondominiumLot storage lot = s_condoLotsList[_lotId];
        lot.ownerAddress = _customerAddress;
        emit LotOwnerSet(_lotId, _customerAddress);
    }

    function registeringAdmin(address _adminAddress, string memory _firstName, string memory _lastName) external {
        // todo not already added
        // if (s_adminList[_adminAddress].) {}
        Admin memory admin;
        admin.firstName = _firstName;
        admin.lastName = _lastName;
        admin.adminAddress = _adminAddress;
        s_adminList.push(admin);
        emit AdminRegistered(_adminAddress, _firstName, _lastName);
    }

    function createGMSharesToken() external {}
    function createGM() external {}
    // set to client who is owner of a given lot his token shares (transfer)
    // if is not really owner
    // if gmId is linked to the owner lot and condo
    // if gmId is open
    // if erc status is ok
    // and ERC20 rules
    function convertSharesToToken(address customer, uint256 gmId) external {}
    // for a given condo
    function modifyStatus() external {}

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getCustomersLength() internal view returns (uint256) {
        return s_customers.length;
    }

    function getCustomerLots(address _customerAddress) external view returns (CondominiumLot[] memory truc) {
        uint256[] memory lotIds = s_customersInfo[_customerAddress].lotIds;
        uint256 size = lotIds.length;
        if (lotIds.length > 0) {
            CondominiumLot[] memory lotsToReturn = new CondominiumLot[](size);
            for (uint256 i = 0; i < lotIds.length; ++i) {
                lotsToReturn[0] = s_condoLotsList[lotIds[i]];
            }
            return lotsToReturn;
        } else {
            revert("dessfsefe");
        }
    }

    function getLotDetail(uint256 _lotId) external view returns (CondominiumLot memory) {
        return s_condoLotsList[_lotId];
    }

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
