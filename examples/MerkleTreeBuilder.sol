// // SPDX-License-Identifier: MIT

// pragma solidity 0.8.28;

// import {IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import {MerkleTree, AirDropClaim, Proof} from "./struct/AirdropClaim.sol";
// import {DurianAirDrop} from "./DurianAirDrop.sol";
// import {DurianDurianToken} from "./DurianDurianToken.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// import {Merkle} from "murky/src/Merkle.sol";
// import {ScriptHelper} from "murky/script/common/ScriptHelper.sol";

// /**
//  * @title MerkleTreeBuilder
//  * @notice in charge of managing the creation of merkle roots for claims (accounts and addresses provided by a owner) store in an array.
//  * When a MerkleTree is finalized, the root, leaves and proofs are generated.
//  * Proofs are store inside, and the root passed to the airdrop
//  */
// contract MerkleTreeBuilder is Ownable, ScriptHelper {
//     /*//////////////////////////////////////////////////////////////
//                             ERRORS
//     //////////////////////////////////////////////////////////////*/
//     error MerkleTreeBuilder__NoDataProvided();
//     error MerkleTreeBuilder__RecipientAlreadyAdded(address recipient);
//     error MerkleTreeBuilder__AmountCantBeZero(address recipient);
//     error MerkleTreeBuilder__CantFinalizeTreeWithoutClaims();

//     /*//////////////////////////////////////////////////////////////
//                             EVENTS
//     //////////////////////////////////////////////////////////////*/
//     event MerkleRootSent(uint256 id);
//     event RecipientAdded(uint256 amount, address recipient);

//     /*//////////////////////////////////////////////////////////////
//                             STATES
//     //////////////////////////////////////////////////////////////*/
//     Merkle private m = new Merkle(); // instance of the merkle contract from Murky
//     uint256 private s_currentTreeId = 0;
//     mapping(uint256 index => MerkleTree) private s_feed;
//     DurianDurianToken private i_token;
//     DurianAirDrop private i_airdrop;

//     constructor(DurianDurianToken token, DurianAirDrop airdrop) Ownable(msg.sender) {
//         i_token = token;
//         i_airdrop = airdrop;
//     }

//     /*//////////////////////////////////////////////////////////////
//                             FUNCTIONS
//     //////////////////////////////////////////////////////////////*/
//     function addAccountAndAddress(address recipient, uint256 amount) public onlyOwner {
//         if (amount == 0) {
//             revert MerkleTreeBuilder__AmountCantBeZero(recipient);
//         }
//         // account already added ?
//         if (isRecipentAlreadyRegistered(s_currentTreeId, recipient)) {
//             revert MerkleTreeBuilder__RecipientAlreadyAdded(recipient);
//         }
//         // add claim to existing MerkleTree and set attributes
//         s_feed[s_currentTreeId].claims.push(AirDropClaim(recipient, amount));
//         s_feed[s_currentTreeId].nbOfClaims++;
//         s_feed[s_currentTreeId].totalAmountToSend += amount;
//         s_feed[s_currentTreeId].recipients[recipient] = true;
//         emit RecipientAdded(amount, recipient);
//     }

//     function finalizeCurrentTree() public onlyOwner {
//         // has claims ?
//         if (getCurrentNbOfClaims() == 0) {
//             revert MerkleTreeBuilder__CantFinalizeTreeWithoutClaims();
//         }
//         handleMerkleTree();
//     }

//     function handleMerkleTree() internal {
//         uint256 idBeingProcessed = getCurrentTreeId();
//         AirDropClaim[] memory claims = s_feed[idBeingProcessed].claims;
//         bytes32[] memory leafs = new bytes32[](claims.length);
//         for (uint256 i = 0; i < claims.length; ++i) {
//             // convert recipient and amount to bytes32
//             bytes32[] memory data = new bytes32[](2);
//             address recipient = claims[i].recipient;
//             // cannot push on fixed array
//             data[0] = bytes32(uint256(uint160(recipient)));
//             uint256 amount = claims[i].amount;
//             data[1] = bytes32(amount);
//             // abi encode the data array (each element is a bytes32 representation for the address and the amount)
//             // ltrim64 Returns the bytes with the first 64 bytes removed
//             // ltrim64 removes the offset and length from the encoded bytes. There is an offset because the array is declared in memory
//             // hash the encoded address and amount
//             // bytes.concat turns from bytes32 to bytes
//             // hash again because preimage attack
//             leafs[i] = keccak256(bytes.concat(keccak256(ltrim64(abi.encode(data)))));
//         }

//         for (uint256 i = 0; i < claims.length; ++i) {
//             bytes32[] memory proofToAdd = m.getProof(leafs, i);
//             // console.log(bytes32ArrayToString(proofToAdd), "proof is ");
//             bytes32[][] storage proofs = s_feed[idBeingProcessed].proofs;
//             // each proof is associated to a related claim and stored
//             proofs.push(proofToAdd);
//         }
//         bytes32 root = m.getRoot(leafs);
//         // lock the merkleTree before interactions
//         s_feed[idBeingProcessed].sendToAirdrop = true;
//         // transfer the total amount of the claims to the airdrop for future transfers
//         i_token.transferFrom(i_token.owner(), address(i_airdrop), getCurrentTotalAmount());
//         // increment id to handle next merkle tree
//         s_currentTreeId++;
//         i_airdrop.addMerkleRoot(idBeingProcessed, root);
//     }

//     /*//////////////////////////////////////////////////////////////
//                   GETTERS RELATED TO CURRENT ID
//     //////////////////////////////////////////////////////////////*/
//     function getCurrentTreeId() public view returns (uint256) {
//         return s_currentTreeId;
//     }

//     function isCurrentMerkleTreeSent() public view returns (bool) {
//         return isMerkleTreeSent(getCurrentTreeId());
//     }

//     function getCurrentTotalAmount() public view returns (uint256) {
//         return getTotalAmountByTree(getCurrentTreeId());
//     }

//     function getCurrentNbOfClaims() public view returns (uint256) {
//         return getNbOfClaimsByTree(getCurrentTreeId());
//     }

//     function getClaimAmountFromCurrentTree(uint256 claimIndex) public view returns (uint256) {
//         return getClaimAmount(getCurrentTreeId(), claimIndex);
//     }

//     function getClaimRecipientFromCurrentTree(uint256 claimIndex) public view returns (address) {
//         return getClaimRecipient(getCurrentTreeId(), claimIndex);
//     }

//     function getCurrentNumberOfProofs() public view returns (uint256) {
//         return getNumberOfProofs(getCurrentTreeId());
//     }

//     /*//////////////////////////////////////////////////////////////
//                             OTHERS GETTERS
//     //////////////////////////////////////////////////////////////*/
//     function isMerkleTreeSent(uint256 id) public view returns (bool) {
//         return s_feed[id].sendToAirdrop;
//     }

//     function getTotalAmountByTree(uint256 id) public view returns (uint256) {
//         return s_feed[id].totalAmountToSend;
//     }

//     function getNbOfClaimsByTree(uint256 id) public view returns (uint256) {
//         return s_feed[id].nbOfClaims;
//     }

//     function isRecipentAlreadyRegistered(uint256 id, address recipientToFind) public view returns (bool) {
//         return s_feed[id].recipients[recipientToFind];
//     }

//     function getNumberOfProofs(uint256 id) public view returns (uint256) {
//         return s_feed[id].proofs.length;
//     }

//     function getLengthOfProof(uint256 id, uint256 index) public view returns (uint256) {
//         return s_feed[id].proofs[index].length;
//     }

//     function getProof(uint256 id, uint256 index) public view returns (bytes32[] memory) {
//         return s_feed[id].proofs[index];
//     }

//     function getProofElement(uint256 id, uint256 index, uint256 elementIndex) public view returns (bytes32) {
//         return s_feed[id].proofs[index][elementIndex];
//     }

//     function getClaimAmount(uint256 id, uint256 claimIndex) public view returns (uint256) {
//         return s_feed[id].claims[claimIndex].amount;
//     }

//     function getClaimRecipient(uint256 id, uint256 claimIndex) public view returns (address) {
//         return s_feed[id].claims[claimIndex].recipient;
//     }
// }
