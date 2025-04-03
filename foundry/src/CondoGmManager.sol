// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Customer, CustomerView, Lot, LotView, CondoGeneralInfo} from "./structs/Manager.sol";
import {TokenWorkflowStatus} from "./structs/Token.sol";
import {GMSharesToken} from "./GmSharesToken.sol";
import {GMBallot} from "./GmBallot.sol";
import {console} from "forge-std/Test.sol";

/// @title CondoGmManager
/// @author Pascal Thao
/// @dev pass in constructor the main information of the targeted condominium
/// @notice Contract designed to handle and managed customers/owners and lots of a given condo
/// will also manipulated and deploy GmSharesToken which is an ERC20 aimed to store the shares of each owner with an equivalent in token (total shares of a condo is 1000)
/// GM means GeneralMeeting
contract CondoGmManager is Ownable {
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
    error CondoGmManager__CantDeployAnotherERC20();
    error CondoGmManager__CustomerHasAlreadyLot(address customer);
    error CondoGmManager__DeployERC20ConditionsNotReached();
    error CondoGmManager__ERC20NotDeployedYet();
    error CondoGmManager__LotSharesAlreadyTokenized(uint256 lotId);
    error CondoGmManager__SharesCantBeZero(string lotOfficialNumber);
    error CondoGmManager__CantDeployAnotherBallot();
    error CondoGmManager__DeployBallotConditionsNotReached();
    error CondoGmManager__VotersAlreadyImported();

    /*//////////////////////////////////////////////////////////////
                         Immutables and constants
    //////////////////////////////////////////////////////////////*/
    uint256 private constant SHARES_LIMIT = 1000;
    string i_postalAddress;
    string i_description;
    string i_condoName;

    /*//////////////////////////////////////////////////////////////
                            STATES
    //////////////////////////////////////////////////////////////*/
    address[] private s_customers;
    mapping(address customerAddress => Customer customer) private s_customersInfo;
    mapping(uint256 lotId => Lot lot) private s_lotsList;
    mapping(string lotOfficialNumber => bool isRegistered) private s_lotsOfficialNumbers;
    uint256 s_nbOfLots;
    uint256 s_currentTotalShares;
    uint256 s_nextLotIndex;
    bool s_addingLotIsLocked;
    bool s_deployERC20IsPossible;
    bool s_ERC20isLocked;
    address s_deployedERC20;
    address s_deployedBallot;
    bool s_allVotersRegistered;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/
    event LotAdded(string indexed condoLotId);
    event CustomerOfLotSet(uint256 indexed lotId, address customer);
    event CustomerCreated(address customerAddress, string firstName, string lastName);
    event TotalSharesReachedMaxLimit();
    event ERC20DeployedIsPossible();
    event ERC20Deployed(address tokenAddress);
    event LogDepositReceived(address sender);

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/
    /// @dev is owner or customer

    modifier hasAccess() {
        if (s_customersInfo[_msgSender()].isRegistered == false && _msgSender() != owner()) {
            revert CondoGmManager__Unauthorized(_msgSender());
        }
        _;
    }

    /// @dev args are just general info about the related condo
    constructor(string memory _name, string memory _description, string memory _postalAddress) Ownable(_msgSender()) {
        s_nextLotIndex = 1;
        i_postalAddress = _postalAddress;
        i_description = _description;
        i_condoName = _name;
    }

    receive() external payable {
        emit LogDepositReceived(msg.sender);
    }

    fallback() external payable {
        require(msg.data.length == 0);
        emit LogDepositReceived(msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                            WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /// @notice register a new customer (owner) which will be connected to a lot
    function registerCustomer(string calldata _firstName, string calldata _lastName, address _customerAddress)
        external
        onlyOwner
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
        // push address to list
        s_customers.push(_customerAddress);
        // store customer complete info
        Customer memory newCustomer;
        newCustomer.lastName = _lastName;
        newCustomer.firstName = _firstName;
        newCustomer.isRegistered = true;
        s_customersInfo[_customerAddress] = newCustomer;
        emit CustomerCreated(_customerAddress, _firstName, _lastName);
    }

    /// @notice : condominium lots are parts of a condominium / shares are the voting weight of a owner for a ballot of GeneralMeeting
    function registerLot(string memory _lotOfficialNumber, uint256 _shares) external onlyOwner {
        if (s_addingLotIsLocked) {
            revert CondoGmManager__RegisteredLotIsLocked(_lotOfficialNumber);
        }
        if (_shares == 0) {
            revert CondoGmManager__SharesCantBeZero(_lotOfficialNumber);
        }
        if (s_lotsOfficialNumbers[_lotOfficialNumber]) {
            revert CondoGmManager__LotAlreadyRegistered(_lotOfficialNumber);
        }
        if (s_currentTotalShares + _shares > SHARES_LIMIT) {
            revert CondoGmManager__TotalSharesExceedsMaxLimit(_lotOfficialNumber);
        }
        if (bytes(_lotOfficialNumber).length == 0) {
            revert CondoGmManager__EmptyString();
        }

        Lot storage newLot = s_lotsList[s_nextLotIndex];
        newLot.shares = _shares;
        newLot.lotOfficialNumber = _lotOfficialNumber;
        // update global states
        s_currentTotalShares += _shares;
        ++s_nbOfLots;
        ++s_nextLotIndex;
        s_lotsOfficialNumbers[_lotOfficialNumber] = true;
        emit LotAdded(_lotOfficialNumber);
        // check if limit of 1000 shares reached, then prevent adding of new lots
        if (s_currentTotalShares == SHARES_LIMIT) {
            s_addingLotIsLocked = true;
            emit TotalSharesReachedMaxLimit();
        }
    }

    /// @notice : a unique lot can only be attached a unique owner
    /// @dev : lot and customer states will be enriched with the entity it is not connected to
    function linkCustomerToLot(address _customerAddress, uint256 _lotId) external onlyOwner {
        if (s_customersInfo[_customerAddress].isRegistered == false) {
            revert CondoGmManager__CustomerNotFound(_customerAddress);
        }
        if (s_customersInfo[_customerAddress].lotId > 0) {
            revert CondoGmManager__CustomerHasAlreadyLot(_customerAddress);
        }
        if (bytes(s_lotsList[_lotId].lotOfficialNumber).length == 0) {
            // lot not found
            revert CondoGmManager__LotNotFound(_lotId);
        }
        if (s_lotsList[_lotId].customerAddress != address(0)) {
            revert CondoGmManager__LotAlreadyHasOwner(_lotId, _customerAddress);
        }

        // set customer address to lot
        s_lotsList[_lotId].customerAddress = _customerAddress;
        // set lot to customer
        s_customersInfo[_customerAddress].lotId = _lotId;
        emit CustomerOfLotSet(_lotId, _customerAddress);
        // if all lots have connected a customer and total shares of lots have reached 1000 / then GmTokeNSahres contract can be deployed to handle "tokenizing" of shares
        if (_checkIfCanDeployERC20()) {
            s_deployERC20IsPossible = true;
        }
    }

    function _checkIfCanDeployERC20() internal view returns (bool) {
        if (s_addingLotIsLocked == false) {
            return false;
        }
        bool canDeploy = true;
        // lot ids start at 1

        for (uint256 id = 1; id < s_nextLotIndex;) {
            if (s_lotsList[id].customerAddress == address(0)) {
                canDeploy = false;
            }
            unchecked {
                ++id;
            }
        }
        return canDeploy;
    }

    /*//////////////////////////////////////////////////////////////
                    WRITE FUNCTIONS -> TOKEN
    //////////////////////////////////////////////////////////////*/
    /// @notice deploy ERC20 and mint 1000 token for owner balance.
    function createGMSharesToken() external onlyOwner {
        if (s_deployERC20IsPossible == false) {
            revert CondoGmManager__DeployERC20ConditionsNotReached();
        }
        if (s_deployedERC20 != address(0)) {
            revert CondoGmManager__CantDeployAnotherERC20();
        }
        // instantiate ERC20 with copro name, adress(this), no decimals, 1000 as max shares
        GMSharesToken deployed = new GMSharesToken("CoproToken ", "COPRO", SHARES_LIMIT);
        s_deployedERC20 = address(deployed);
        // mint 1000 token and grant them to owner
        deployed.initialMinting(SHARES_LIMIT);
    }

    /// @dev gives the order to ERC20 to authorize transfer of shares from owner to customers
    function openTokenizingOfShares() external onlyOwner {
        if (s_deployedERC20 == address(0)) {
            revert CondoGmManager__ERC20NotDeployedYet();
        }
        GMSharesToken(s_deployedERC20).openTokenizingOfShares();
    }

    /// @notice select a given lot and call ERC20 to transfer attached shares from owner to related customer balance
    function convertLotSharesToToken(uint256 _lotId) external onlyOwner {
        if (s_deployedERC20 == address(0)) {
            revert CondoGmManager__ERC20NotDeployedYet();
        }
        Lot storage lot = s_lotsList[_lotId];
        if (lot.isTokenized) {
            revert CondoGmManager__LotSharesAlreadyTokenized(_lotId);
        }

        bool response = GMSharesToken(s_deployedERC20).transfer(lot.customerAddress, lot.shares);
        if (response) {
            lot.isTokenized = true;
            TokenWorkflowStatus status = GMSharesToken(s_deployedERC20).getCurrentStatus();
            if (status == TokenWorkflowStatus.ContractLocked) {
                s_ERC20isLocked = true;
                // when erc20 is locked, information address is given to ballot
                GMBallot(s_deployedBallot).setERC20Address(s_deployedERC20);
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                     WRITE FUNCTIONS -> BALLOT
    //////////////////////////////////////////////////////////////*/
    /// @notice manager will transfer to Ballot the official list of lots + customers in order to start the process of GM
    function loadSharesAndCustomersToBallot() external onlyOwner {
        if (s_allVotersRegistered) {
            revert CondoGmManager__VotersAlreadyImported();
        }
        if (s_nbOfLots > 1) {
            // prevent from reentrancy
            s_allVotersRegistered = true;
            // lot ids start at 1, we'll register each customer as voter in ballot
            for (uint256 id = 1; id < s_nextLotIndex;) {
                Customer memory tempCustomer = s_customersInfo[s_lotsList[id].customerAddress];
                GMBallot(s_deployedBallot).registerVoter(
                    s_lotsList[id].customerAddress,
                    tempCustomer.firstName,
                    tempCustomer.lastName,
                    s_lotsList[id].lotOfficialNumber,
                    s_lotsList[id].shares
                );
                unchecked {
                    ++id;
                }
            }
        }
    }

    function setGMBallotAddress(address _ballotAddress) external {
        s_deployedBallot = _ballotAddress;
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS / CONDO INFO
    //////////////////////////////////////////////////////////////*/
    function getGeneralInfos() external view returns (CondoGeneralInfo memory) {
        return CondoGeneralInfo(i_condoName, i_description, i_postalAddress);
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS / CUSTOMERS
    //////////////////////////////////////////////////////////////*/
    function getCustomersInfos() external view returns (CustomerView[] memory) {
        CustomerView[] memory customersToReturn = new CustomerView[](s_customers.length);

        if (s_customers.length > 0) {
            for (uint256 i = 0; i < s_customers.length;) {
                Customer memory c = s_customersInfo[s_customers[i]];
                CustomerView memory customer = CustomerView({
                    isRegistered: c.isRegistered,
                    lastName: c.lastName,
                    firstName: c.firstName,
                    customerAddress: s_customers[i],
                    lotId: c.lotId,
                    lotOfficialNumber: s_lotsList[c.lotId].lotOfficialNumber
                });

                customersToReturn[i] = customer;
                unchecked {
                    ++i;
                }
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
    function getLotsInfos() external view returns (LotView[] memory) {
        // lots id start at 1. If s_nextLotIndex = 1 then array will zero size, then empty
        LotView[] memory lotsToReturn = new LotView[](s_nextLotIndex - 1);
        if (s_nextLotIndex > 1) {
            // lot ids start at 1
            for (uint256 id = 1; id < s_nextLotIndex;) {
                Customer memory tempCustomer = s_customersInfo[s_lotsList[id].customerAddress];
                LotView memory tempLot = LotView({
                    id: id,
                    shares: s_lotsList[id].shares,
                    lotOfficialNumber: s_lotsList[id].lotOfficialNumber,
                    lastName: tempCustomer.lastName,
                    firstName: tempCustomer.firstName,
                    customerAddress: s_lotsList[id].customerAddress,
                    isTokenized: s_lotsList[id].isTokenized
                });
                lotsToReturn[id - 1] = tempLot;
                unchecked {
                    ++id;
                }
            }
        }

        return lotsToReturn;
    }

    function getLotById(uint256 _lotId) external view returns (Lot memory) {
        return s_lotsList[_lotId];
    }

    function getNbOfLots() external view returns (uint256) {
        return s_nbOfLots;
    }

    function getAddingLotIsLocked() external view returns (bool) {
        return s_addingLotIsLocked;
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS / LOTS
    //////////////////////////////////////////////////////////////*/
    function getsDeployERC20IsPossible() external view returns (bool) {
        return s_deployERC20IsPossible;
    }

    function getERC20isLocked() external view returns (bool) {
        return s_ERC20isLocked;
    }

    /*//////////////////////////////////////////////////////////////
                        CHILD CONTRACTS
    //////////////////////////////////////////////////////////////*/
    function getERC20Address() external view returns (address) {
        return s_deployedERC20;
    }

    function getBallotAddress() external view returns (address) {
        return s_deployedBallot;
    }
}
