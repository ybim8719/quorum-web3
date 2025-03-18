// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Customer, CondominiumLot, GeneralMeeting, Admin} from "./structs/Manager.sol";

/// @title CondominiumGMFactory
/// @author Pascal Thao
/// @dev pass in constructor the main information of the targeted condominium
/// @notice Contract designed to handle state of a given condominium
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
    error CondomGMFactory__AdminAlreadyAdded(address adminAddress);
    error CondomGMFactory__AdminListFull(address adminAddress);

    uint256 private constant SHARES_LIMIT = 1000;

    string i_postalAddress;
    string i_description;
    string i_condoName;
    uint256 i_maxAdminNb;

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
    /// @notice has to the right to access admin dashboard
    modifier isAdminOrOwner() {
        if (_msgSender() != owner()) {
            bool isAdmin = false;
            for (uint256 i = 0; i < s_adminList.length; i++) {
                if (s_adminList[i].adminAddress == _msgSender()) {
                    isAdmin = true;
                }
            }
            if (isAdmin == false) {
                revert CondomGMFactory__Unauthorized(_msgSender());
            }
        }
        _;
    }

    /// @notice is owner/ admin or customer
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

    constructor(string memory _name, string memory _description, string memory _postalAddress, uint256 _maxAdminNb)
        Ownable(_msgSender())
    {
        s_nextLotIndex = 1;
        i_postalAddress = _postalAddress;
        i_description = _description;
        i_condoName = _name;
        i_maxAdminNb = _maxAdminNb;
    }

    /// @dev add a new customer (owner) of
    function registerCustomer(string calldata _firstName, string calldata _lastName, address _customerAddress)
        external
        isAdminOrOwner
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

    /// @notice : lot are the "parts" of the condominium
    function registerLot(string memory _lotOfficialNumber, uint256 _shares) external isAdminOrOwner {
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
        // 1000 shares reached, stop all new lots
        if (s_currentTotalShares == SHARES_LIMIT) {
            s_addingLotIsLocked = true;
            emit LotsAllRegistered();
        }
    }

    /// @notice : when a lot is added, it has to be linked to its owner. The owner can own multiple lots from the same condo.
    function linkCustomerToLot(address _customerAddress, uint256 _lotId) external isAdminOrOwner {
        if (s_customersInfo[_customerAddress].isRegistered == false) {
            revert CondomGMFactory__CustomerNotFound(_customerAddress);
        }
        if (bytes(s_condoLotsList[_lotId].lotOfficalNumber).length == 0) {
            // lot not be found
            revert CondomGMFactory__LotNotFound(_lotId);
        }
        if (s_condoLotsList[_lotId].ownerAddress != address(0)) {
            revert CondomGMFactory__LotAlreadyHasOwner(_lotId, _customerAddress);
        }

        // set customer address to lot
        s_condoLotsList[_lotId].ownerAddress = _customerAddress;
        // set lot to customer
        s_customersInfo[_customerAddress].lotIds.push(_lotId);
        emit LotOwnerSet(_lotId, _customerAddress);
    }

    /// @notice : admins are employees authorized to handle admin tasks
    function registeringAdmin(string memory _firstName, string memory _lastName, address _adminAddress)
        external
        onlyOwner
    {
        if (s_adminList.length > i_maxAdminNb - 1) {
            revert CondomGMFactory__AdminListFull(_adminAddress);
        }
        if (s_adminList.length > 0) {
            for (uint256 i = 0; i < s_adminList.length; ++i) {
                if (s_adminList[i].adminAddress == _adminAddress) {
                    revert CondomGMFactory__AdminAlreadyAdded(_adminAddress);
                }
            }
        }

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
    function getCustomersLength() external view returns (uint256) {
        return s_customers.length;
    }

    function getCustomerLots(address _customerAddress) external view returns (CondominiumLot[] memory) {
        uint256[] memory lotIds = s_customersInfo[_customerAddress].lotIds;
        uint256 size = lotIds.length;
        if (lotIds.length > 0) {
            CondominiumLot[] memory lotsToReturn = new CondominiumLot[](size);
            for (uint256 i = 0; i < lotIds.length; ++i) {
                lotsToReturn[0] = s_condoLotsList[lotIds[i]];
            }
            return lotsToReturn;
        } else {
            CondominiumLot[] memory emptyTable = new CondominiumLot[](0);
            return emptyTable;
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
