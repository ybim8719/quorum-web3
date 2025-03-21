// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    Customer, CondominiumLot, GeneralMeeting, Admin, CustomerView, CondominiumLotView
} from "./structs/Manager.sol";

/// @title CondoGmManager
/// @author Pascal Thao
/// @dev pass in constructor the main information of the targeted condominium
/// @notice Contract designed to handle state of a given condominium
contract CondoGmManager is Ownable {
    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    event LotAdded(string indexed condoLotId);
    event CustomerOfLotSet(uint256 indexed lotId, address customer);
    event CustomerCreated(address customerAddress, string firstName, string lastName);
    event AdminRegistered(address adminAddress, string firstName, string lastName);
    event LotsAllRegistered();
    event ERC20Deployed(address tokenAddress);

    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/
    error CondoGmManager__Unauthorized(address unauthorizedVoter);
    error CondoGmManager__CustomerAlreadyRegistered(address customer);
    error CondoGmManager__EmptyString();
    error CondoGmManager__AddressCantBeZero();
    error CondoGmManager__LotAlreadyRegistered(string lotOfficialNumber);
    error CondoGmManager__TotalSharesExceedsMaxLimit(string lotOfficialNumber);
    error CondoGmManager__LotAlreadyHasOwner(uint256 lotId, address customerAddress);
    error CondoGmManager__CustomerNotFound(address customerAddress);
    error CondoGmManager__LotNotFound(uint256 lotId);
    error CondoGmManager__RegisteredLotIsLocked(string lotOfficialNumber);
    error CondoGmManager__AdminAlreadyAdded(address adminAddress);
    error CondoGmManager__AdminListFull(address adminAddress);
    error CondoGmManager__CantRevertAnotherERC20();

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
    address s_deployedErc20;

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
                revert CondoGmManager__Unauthorized(_msgSender());
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
                revert CondoGmManager__Unauthorized(_msgSender());
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
            revert CondoGmManager__CustomerAlreadyRegistered(_customerAddress);
        }
        if (_customerAddress == address(0)) {
            revert CondoGmManager__AddressCantBeZero();
        }
        if (bytes(_firstName).length == 0 || bytes(_lastName).length == 0) {
            revert CondoGmManager__EmptyString();
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
            revert CondoGmManager__RegisteredLotIsLocked(_lotOfficialNumber);
        }
        if (s_lotsOfficialNumbers[_lotOfficialNumber]) {
            revert CondoGmManager__LotAlreadyRegistered(_lotOfficialNumber);
        }
        if (s_currentTotalShares + _shares > SHARES_LIMIT) {
            revert CondoGmManager__TotalSharesExceedsMaxLimit(_lotOfficialNumber);
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

    /// @notice : when a lot is added, it has to be linked to its customer. The owner can own multiple lots from the same condo.
    function linkCustomerToLot(address _customerAddress, uint256 _lotId) external isAdminOrOwner {
        if (s_customersInfo[_customerAddress].isRegistered == false) {
            revert CondoGmManager__CustomerNotFound(_customerAddress);
        }
        if (bytes(s_condoLotsList[_lotId].lotOfficalNumber).length == 0) {
            // lot not be found
            revert CondoGmManager__LotNotFound(_lotId);
        }
        if (s_condoLotsList[_lotId].customerAddress != address(0)) {
            revert CondoGmManager__LotAlreadyHasOwner(_lotId, _customerAddress);
        }

        // set customer address to lot
        s_condoLotsList[_lotId].customerAddress = _customerAddress;
        // set lot to customer
        s_customersInfo[_customerAddress].lotIds.push(_lotId);
        emit CustomerOfLotSet(_lotId, _customerAddress);
    }

    /// @notice : admins are employees authorized to handle admin tasks
    function registeringAdmin(string memory _firstName, string memory _lastName, address _adminAddress)
        external
        onlyOwner
    {
        if (s_adminList.length > i_maxAdminNb - 1) {
            revert CondoGmManager__AdminListFull(_adminAddress);
        }
        if (s_adminList.length > 0) {
            for (uint256 i = 0; i < s_adminList.length; ++i) {
                if (s_adminList[i].adminAddress == _adminAddress) {
                    revert CondoGmManager__AdminAlreadyAdded(_adminAddress);
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

    /// @dev add a new customer (owner) of
    function createGMSharesToken() external {
        if (s_deployedErc20 != address(0)) {
            revert CondoGmManager__CantRevertAnotherERC20();
        }
        // instantiate ERC20 with copro name, adress(this), no decimals, 1000 as max shares

        // save address of token

        // set to 1000 token and no decimals
    }

    function createGMBallot() external {}
    // if is not really owner
    // if gmId is linked to the owner lot and condo
    // if gmId is open
    // if erc status is ok
    // and ERC20 rules
    function convertSharesToToken(uint256 lotId) external {
        // select a given lot and transfer equivalent of shares to customerAddress

        //
    }

    // open and locked ERC20 transfert
    function setTokenStatus() external {}

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS / CUSTOMERS
    //////////////////////////////////////////////////////////////*/
    function getCustomers() external view returns (CustomerView[] memory) {
        CustomerView[] memory customersToReturn = new CustomerView[](s_customers.length);
        if (s_customers.length > 0) {
            for (uint256 i = 0; i < s_customers.length; ++i) {
                Customer memory c = s_customersInfo[s_customers[i]];
                CustomerView memory customer = new CustomerView({
                    isRegistered: c.isRegistered,
                    lastName: c.lastName,
                    firstName: c.firstName,
                    wallet: s_customers[i],
                    lotIds: c.lotIds
                });
                customersToReturn[i] = customer;
            }
        }

        return customersToReturn;
    }

    function getCustomersList() external view returns (address[] memory) {
        return s_customers;
    }

    function getNbOfCustomers() external view returns (uint256) {
        return s_customers.length;
    }

    function getCustomerDetail(address _customerAddress) external view returns (Customer memory) {
        return s_customersInfo[_customerAddress];
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS / LOTS
    //////////////////////////////////////////////////////////////*/
    function getLots() external view returns (CondominiumLotView[] memory) {
        CondominiumLotView[] memory lots = new CondominiumLotView[](s_nextLotIndex);
        if (s_nextLotIndex > 1) {
            for (uint256 i = 1; i < s_nextLotIndex; ++i) {
                Customer memory tempCustomer = s_customersInfo[s_condoLotsList[i].customerAddress];
                CondominiumLotView memory tempLot = CondominiumLotView({
                    shares: s_condoLotsList[i].shares,
                    lotOfficiallNumber: s_condoLotsList[i].lotOfficiallNumber,
                    firstName: tempCustomer.lastName,
                    firstName: tempCustomer.firstName,
                    customerAddress: s_condoLotsList[i].customerAddress
                });
                lots[i - 1] = tempLot;
            }
        }

        return lots;
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

    // receive() external payable {
    //     emit LogDepositReceived(msg.sender);
    // }

    // fallback() external payable {
    //     require(msg.data.length == 0);
    //     emit LogDepositReceived(msg.sender);
    // }
}
