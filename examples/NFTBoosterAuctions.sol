// // SPDX-License-Identifier: MIT

// pragma solidity ^0.8.28;

// import {Auction, AuctionStatus} from "./structs/Auction.sol";
// import {NFTBooster} from "./NFTBooster.sol";
// import {console} from "forge-std/Script.sol";
// import {AutomationCompatibleInterface} from
//     "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

// /**
//  * @notice NFTBoosterAuctions is a bid application of aunction selling the ownership of a set of nft designed by a unique artist (also called booster)
//  * The artworks are hosted on chain, since they are svg files encoded on base 64. The particylarity of the auction is that the
//  * pictures are only exposed when the final bid is achieved and final NFT contract deployed.
//  * After deployment of contract, a unlimited number of auctions can be send by the owner of the contract
//  * For more, follow instructions in the read me file or in the Contract script/DeployNFTBoosterAuction.s.sol
//  * @author ybim
//  * @dev chainlink automation upkeep functions are implemented in the contract. Once the contract is deployed, logic-based triggering
//  * can be applied to handled the closure of a given aunction.
//  */
// contract NFTBoosterAuctions is AutomationCompatibleInterface {
//     /*//////////////////////////////////////////////////////////////
//                             ERRORS
//     //////////////////////////////////////////////////////////////*/
//     error NFTBoosterAuctions__OwnerOnly();
//     error NFTBoosterAuctions__UpkeepNotNeeded();
//     error NFTBoosterAuctions__InvalidBiddingAmount(address caller, uint256 sentValue);
//     error NFTBoosterAuctions__BidAlreadyAchieved(uint256 index);
//     error NFTBoosterAuctions__BidNotOpen(uint256 index);
//     error NFTBoosterAuctions__ExpiryDateNotReachedYet(uint256 index);
//     error NFTBoosterAuctions__UnsufficientFunds(uint256 amountToSend, uint256 currentBalance);
//     error NFTBoosterAuctions__CantBidWhenAlreadyBestBidder(uint256 index);
//     error NFTBoosterAuctions__NoOneHasBid(uint256 index);
//     error NFTBoosterAuctions__CantClosedAuction(uint256 index);

//     /*//////////////////////////////////////////////////////////////
//                             EVENTS
//     //////////////////////////////////////////////////////////////*/
//     event NewBid(uint256 indexed AuctionIndex, address indexed bestBidder, uint256 indexed bid);
//     event BidEnded(uint256 indexed AuctionIndex, address indexed bestBidder, uint256 indexed bid);

//     /*//////////////////////////////////////////////////////////////
//                             STATES
//     //////////////////////////////////////////////////////////////*/
//     address private i_owner;
//     Auction[] private s_auctions;
//     uint256 private constant MEMBERSHIP_FEE = 0.01 ether;

//     /*//////////////////////////////////////////////////////////////
//                             MODIFIERS
//     //////////////////////////////////////////////////////////////*/
//     modifier ownerOnly() {
//         if (msg.sender != i_owner) {
//             revert NFTBoosterAuctions__OwnerOnly();
//         }
//         _;
//     }

//     modifier isBiddable(uint256 i) {
//         // check if not already deployed
//         if (s_auctions[i].deployed != address(0)) {
//             revert NFTBoosterAuctions__BidAlreadyAchieved(i);
//         }
//         if (s_auctions[i].status != AuctionStatus.OPEN) {
//             revert NFTBoosterAuctions__BidNotOpen(i);
//         }
//         _;
//     }

//     constructor() {
//         i_owner = msg.sender;
//     }

//     function addAuction(
//         string memory _description,
//         string memory _symbol,
//         string memory _name,
//         uint256 _startingBid,
//         uint256 _bidStep,
//         uint256 _bidDuration,
//         string[] memory imageUris
//     ) public ownerOnly {
//         s_auctions.push(
//             Auction(
//                 AuctionStatus.READY,
//                 _description,
//                 _symbol,
//                 _name,
//                 _startingBid,
//                 _bidDuration,
//                 0,
//                 _bidStep,
//                 0,
//                 address(0),
//                 address(0),
//                 imageUris
//             )
//         );
//     }

//     function cancelAunction(uint256 i) public ownerOnly {
//         if (getStatus(i) == AuctionStatus.READY) {
//             s_auctions[i].status = AuctionStatus.CLOSED;
//         } else if (getStatus(i) == AuctionStatus.OPEN && getBestBidder(i) == address(0)) {
//             s_auctions[i].status = AuctionStatus.CLOSED;
//         } else {
//             revert NFTBoosterAuctions__CantClosedAuction(i);
//         }
//     }

//     function openAuction(uint256 i) public ownerOnly {
//         if (s_auctions[i].status == AuctionStatus.READY && s_auctions[i].deployed == address(0)) {
//             s_auctions[i].status = AuctionStatus.OPEN;
//             s_auctions[i].openingTimeStamp = block.timestamp;
//         } else {
//             revert NFTBoosterAuctions__BidAlreadyAchieved(i);
//         }
//     }

//     function bidForAuction(uint256 i) public payable isBiddable(i) {
//         //CHECK if previous isn't the same as msg.sender
//         if (msg.sender == s_auctions[i].bestBidder) {
//             revert NFTBoosterAuctions__CantBidWhenAlreadyBestBidder(i);
//         }
//         //check if amount sent is ok for winning the bid
//         if (msg.value != getNextBiddingPriceInWei(i)) {
//             revert NFTBoosterAuctions__InvalidBiddingAmount(msg.sender, msg.value);
//         }

//         // store previous bidder info for payback
//         address prevBidder = s_auctions[i].bestBidder;
//         uint256 prevBidStep = s_auctions[i].nextBidStep;
//         //EFFECTS
//         s_auctions[i].bestBidder = msg.sender;
//         s_auctions[i].nextBidStep++;

//         // INTERACTIONS : payback money to previous bidder.
//         if (prevBidder != address(0)) {
//             uint256 prevBestAmount = s_auctions[i].startingBid + (prevBidStep * (prevBidStep - 1));
//             // then check contract balance
//             if (address(this).balance < prevBestAmount) {
//                 revert NFTBoosterAuctions__UnsufficientFunds(prevBestAmount, address(this).balance);
//             }
//             (bool callSuccess,) = payable(prevBidder).call{value: prevBestAmount}("");
//             require(callSuccess, "Call failed");
//         }
//         emit NewBid(i, msg.sender, msg.value);
//     }

//     // for given auction do controls and pick the winner, create the ERC721 contract and mint the related nfts
//     function checkAndEndAuction(uint256 i) public ownerOnly {
//         // is open
//         if (s_auctions[i].status != AuctionStatus.OPEN) {
//             revert NFTBoosterAuctions__BidNotOpen(i);
//         }
//         // if no one has ever bid, keep the aunction open until somebody add a bid (despite expiry date)
//         if (getBestBidder(i) == address(0)) {
//             revert NFTBoosterAuctions__NoOneHasBid(i);
//         }
//         // has enougth time passed to close the aunction ?
//         if (hasDurationDatePassed(i) == false) {
//             revert NFTBoosterAuctions__ExpiryDateNotReachedYet(i);
//         }

//         endAuction(i);
//     }

//     function endAuction(uint256 i) internal {
//         address winner = getBestBidder(i);
//         // modif status to prevent reentrancy issues
//         s_auctions[i].status = AuctionStatus.CLOSED;
//         // create new NFT contract , this contract is the temp owner
//         NFTBooster nftBooster = new NFTBooster(
//             getName(i),
//             getSymbol(i),
//             getAunctionDescription(i),
//             getCurrentBiddingPriceInWei(i),
//             getAunctionNFTLength(i),
//             address(this)
//         );
//         s_auctions[i].deployed = address(nftBooster);
//         // mint NFT one by one, by passing URI and bid winner, operation made by msg.sender
//         for (uint256 j = 0; j < getAunctionNFTLength(i); j++) {
//             nftBooster.mintNft(getAuctionNFT(i, j), winner);
//         }
//         // transfer contract ownership to winner
//         nftBooster.transferOwnership(winner);
//         // send the final bidding amount
//         uint256 finalBidAmount = getCurrentBiddingPriceInWei(i);
//         if (address(this).balance < finalBidAmount) {
//             revert NFTBoosterAuctions__UnsufficientFunds(finalBidAmount, address(this).balance);
//         }
//         (bool callSuccess,) = payable(i_owner).call{value: finalBidAmount}("");
//         require(callSuccess, "Call failed");
//         emit BidEnded(i, winner, finalBidAmount);
//     }

//     /*//////////////////////////////////////////////////////////////
//                             ORACLE AUTOMATION
//     //////////////////////////////////////////////////////////////*/
//     /**
//      * @dev This is the function that the Chainlink Keeper nodes call (off chain operation)
//      * to look for `upkeepNeeded` to return true.
//      */
//     function checkUpkeep(bytes memory /* checkData */ )
//         public
//         view
//         override
//         returns (bool upkeepNeeded, bytes memory performData)
//     {
//         for (uint256 i = 0; i < s_auctions.length;) {
//             if (
//                 s_auctions[i].status == AuctionStatus.OPEN && getBestBidder(i) != address(0) && hasDurationDatePassed(i)
//             ) {
//                 performData = abi.encode(i);
//                 return (true, performData);
//             }
//             unchecked {
//                 i++;
//             }
//         }
//         return (false, "");
//     }

//     /**
//      * @dev Once `checkUpkeep` is returning `true`, this function is called
//      * and it decodes "performData" and uses it to end the aunction
//      * @notice to register an logic-based upkeep: https://docs.chain.link/chainlink-automation/guides/register-upkeep
//      */
//     function performUpkeep(bytes calldata performData) external override {
//         // recall the check once more to prevent any unappropriate calls (not made by chainlink)
//         (bool upkeepNeeded,) = checkUpkeep("");
//         if (!upkeepNeeded) {
//             revert NFTBoosterAuctions__UpkeepNotNeeded();
//         }
//         uint256 index = abi.decode(performData, (uint256));
//         endAuction(index);
//     }

//     /*//////////////////////////////////////////////////////////////
//                             PURE/ VIEWS
//     //////////////////////////////////////////////////////////////*/
//     function hasDurationDatePassed(uint256 i) internal view returns (bool) {
//         return block.timestamp - s_auctions[i].openingTimeStamp > s_auctions[i].bidDuration;
//     }

//     function getStatus(uint256 i) public view returns (AuctionStatus) {
//         return s_auctions[i].status;
//     }

//     function getBidDuration(uint256 i) public view returns (uint256) {
//         return s_auctions[i].bidDuration;
//     }

//     function isAunctionPublished(uint256 i) public view returns (bool) {
//         return s_auctions[i].status == AuctionStatus.OPEN;
//     }

//     function getName(uint256 i) public view returns (string memory) {
//         return s_auctions[i].name;
//     }

//     function getSymbol(uint256 i) public view returns (string memory) {
//         return s_auctions[i].symbol;
//     }

//     function getNbOfAuctions() public view returns (uint256) {
//         return s_auctions.length;
//     }

//     function getAuctionNFT(uint256 i, uint256 j) public view returns (string memory) {
//         return s_auctions[i].nftImageUris[j];
//     }

//     function getAunctionDescription(uint256 i) public view returns (string memory) {
//         return s_auctions[i].description;
//     }

//     function getAunctionNFTLength(uint256 i) public view returns (uint256) {
//         return s_auctions[i].nftImageUris.length;
//     }

//     function getStartingBid(uint256 i) public view returns (uint256) {
//         return s_auctions[i].startingBid;
//     }

//     function getNextBiddingPriceInWei(uint256 i) public view returns (uint256) {
//         return (s_auctions[i].startingBid + (s_auctions[i].bidStep * s_auctions[i].nextBidStep));
//     }

//     function getCurrentBiddingPriceInWei(uint256 i) public view returns (uint256) {
//         return (s_auctions[i].startingBid + (s_auctions[i].bidStep * (s_auctions[i].nextBidStep - 1)));
//     }

//     function getOwner() public view returns (address) {
//         return i_owner;
//     }

//     function getBestBidder(uint256 i) public view returns (address) {
//         return s_auctions[i].bestBidder;
//     }

//     function getDeployed(uint256 i) public view returns (address) {
//         return s_auctions[i].deployed;
//     }

//     function getBidStep(uint256 i) public view returns (uint256) {
//         return s_auctions[i].bidStep;
//     }
// }
