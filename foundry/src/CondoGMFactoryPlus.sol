// // SPDX-License-Identifier: MIT

// pragma solidity ^0.8.26;

// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
// import {Customer, Condominium, CondominiumLot, GeneralMeeting, Admin} from "./structs/Manager.sol";

// /// @title CondominiumGMFactory
// /// @author Pascal Thao
// /// @dev Bfsfsefse
// /// @notice dedse

// contract CondoGMFactoryPlus is Ownable {
//     /*//////////////////////////////////////////////////////////////
//                             EVENTS
//     //////////////////////////////////////////////////////////////*/
//     event CondiminiumCreated(uint256 indexed condoId);
//     event CondiminiumLotAdded(string indexed condoLotId);
//     event CondiminiumLotOwnerSet(uint256 indexed lotId, address owner);
//     event CustomerCreated(address customerAddress);
//     event AdminRegistered(address adminAddress, string firstName, string lastName);

//     /*//////////////////////////////////////////////////////////////
//                             ERRORS
//     //////////////////////////////////////////////////////////////*/
//     error CondomGMFactory__NotACustomer(address unauthorizedVoter);
//     error CondomGMFactory__NotAnAdmin(address unauthorizedVoter);
//     error CondomGMFactory__Unauthorized(address unauthorizedVoter);
//     error CondomGMFactory__CustomerAlreadyRegistered(address customer);
//     error CondomGMFactory__EmptyString();
//     error CondomGMFactory__AddressCantBeZero();

//     uint256 private constant SHARES_LIMIT = 1000;
//     /*//////////////////////////////////////////////////////////////
//                             STATES
//     //////////////////////////////////////////////////////////////*/
//     Admin[] private s_adminList;
//     address[] private s_customers;
//     mapping(address customerAddress => Customer customer) private s_customersInfo;
//     mapping(uint256 condoId => Condominium) private s_condominiumList;
//     mapping(string lotId => CondominiumLot lot) private s_condoLotsList;
//     mapping(string trigram => bool isTaken) private s_trigramList;

//     uint256 s_nextCondoId = 1;

//     /*//////////////////////////////////////////////////////////////
//                             MODIFIERS
//     //////////////////////////////////////////////////////////////*/
//     modifier isAdminOrOwner() {
//         if (_msgSender() != owner()) {
//             bool isAdmin = false;
//             for (uint256 i = 0; i < s_adminList.length; i++) {
//                 if (s_adminList[i].adminAddress == _msgSender()) {
//                     isAdmin = true;
//                 }
//             }
//             if (isAdmin) {
//                 revert CondomGMFactory__Unauthorized(_msgSender());
//             }
//         }
//         _;
//     }

//     modifier hasAccess() {
//         if (s_customersInfo[_msgSender()].isRegistered == false && _msgSender() != owner()) {
//             bool isAdmin = false;
//             for (uint256 i = 0; i < s_adminList.length; i++) {
//                 if (s_adminList[i].adminAddress == _msgSender()) {
//                     isAdmin = true;
//                 }
//             }
//             if (isAdmin) {
//                 revert CondomGMFactory__Unauthorized(_msgSender());
//             }
//         }
//         _;
//     }

//     constructor() Ownable(_msgSender()) {}

//     /// @dev add a new condo with minimal description
//     // OK
//     function createCondominium(string calldata _postalAddress, string calldata _description, string calldata _trigram)
//         external
//     {
//         // TODO trigram not taken already
//         // empty strings
//         if (bytes(_postalAddress).length == 0 || bytes(_description).length == 0) {
//             revert CondomGMFactory__EmptyString();
//         }
//         Condominium storage newCondo = s_condominiumList[s_nextCondoId];
//         newCondo.postalAddress = _postalAddress;
//         newCondo.trigram = _trigram;
//         newCondo.description = _description;
//         newCondo.nextLotIndex = 1;
//         emit CondiminiumCreated(s_nextCondoId);
//         ++s_nextCondoId;
//     }

//     /// @dev add a new customer (owner) to admin db
//     function registerCustomer(string calldata _firstName, string calldata _lastName, address _customerAddress)
//         external
//     {
//         if (s_customersInfo[_customerAddress].isRegistered == true) {
//             revert CondomGMFactory__CustomerAlreadyRegistered(_customerAddress);
//         }
//         if (_customerAddress == address(0)) {
//             revert CondomGMFactory__AddressCantBeZero();
//         }
//         if (bytes(_firstName).length == 0 || bytes(_lastName).length == 0) {
//             revert CondomGMFactory__EmptyString();
//         }

//         // Keep bu not sure...
//         s_customers.push(_customerAddress);
//         Customer memory newCustomer;
//         newCustomer.lastName = _lastName;
//         newCustomer.firstName = _firstName;
//         newCustomer.isRegistered = true;
//         s_customersInfo[_customerAddress] = newCustomer;
//         emit CustomerCreated(_customerAddress);
//     }

//     function addLotToCondominium(uint256 _shares, uint256 _condoIndex, string memory _lotInternalNumber) external {
//         //https://ethereum.stackexchange.com/questions/10811/solidity-concatenate-uint-into-a-string
//         if (s_condoLotsList[_condoIndex].exists == false) {
//             revert("desddddedds");
//         }
//         if (s_condoLotsList[_condoIndex].currentTotalShares + _shares > SHARES_LIMIT) {
//             revert("desds");
//         }

//         string nextLotCode = string.concat(
//             s_condoLotsList[_condoIndex].trigram, Strings.toString(s_condoLotsList[_condoIndex].nextLotIndex)
//         );
//         if (s_condoLotsList[nextLotCode]) {

//         }

//         // add to lotlist and inside this condo
//         uint256[] storage lots = s_condominiumList[_condoId].lotCodes;

//         CondominiumLot memory newLot =
//         // condo.share += _shares;
//         // condo.trigram
//         // condo.lots.push(CondominiumLot({}));

//         // emit CondiminiumLotAdded(lot.lotInternalNumber);
//     }

//     // function linkCustomerToLot(address _customerAddress, uint256 _condoId, uint256 _lotId) external {
//     //     // lot must have no customer yet
//     //     // customer must exist in customer list
//     //     CondominiumLot storage lot = s_condominiumList[_condoId].lots[_lotId];
//     //     lot.ownerAddress = _customerAddress;
//     //     emit CondiminiumLotOwnerSet(_lotId, _customerAddress);
//     // }

//     function addAdmin(address _adminAddress, string memory _firstName, string memory _lastName) external {
//         // todo not already added
//         // not a customer
//         Admin memory admin;
//         admin.firstName = _firstName;
//         admin.lastName = _lastName;
//         admin.adminAddress = _adminAddress;
//         s_adminList.push(admin);
//         emit AdminRegistered(_adminAddress, _firstName, _lastName);
//     }

//     function createGMSharesToken() external {}
//     function createGM() external {}
//     // set to client who is owner of a given lot his token shares (transfer)
//     // if is not really owner
//     // if gmId is linked to the owner lot and condo
//     // if gmId is open
//     // if erc status is ok
//     // and ERC20 rules
//     function assignShares(address customer, uint256 gmId) external {}
//     // for a given condo
//     function modifyStatus() external {}

//     /*//////////////////////////////////////////////////////////////
//                             VIEW FUNCTIONS
//     //////////////////////////////////////////////////////////////*/
//     // function getAllCondos() external view returns (Condominium[] memory) {
//     //     return s_condominiumList;
//     // }

//     // function getCondoDetails(uint256 _condoId) external view returns (Condominium memory) {
//     //     return s_condominiumList[_condoId];
//     // }

//     function getCustomers() external {}
//     function getCustomerLots(address customerAddress) external {}

//     /// @dev override Ownable owner() which is not protected
//     // function owner() public view override returns (address) {
//     //     if (_msgSender() != super.owner() && s_whiteList[_msgSender()].isRegistered == false) {
//     //         revert VotingOpti__StateNotReachable(_msgSender());
//     //     }
//     //     return super.owner();
//     // }

//     // receive() external payable {
//     //     emit LogDepositReceived(msg.sender);
//     // }

//     // fallback() external payable {
//     //     require(msg.data.length == 0);
//     //     emit LogDepositReceived(msg.sender);
//     // }
// }
