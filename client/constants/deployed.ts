export const network = {
  anvil: {
    manager: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ballot: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  },
  sepolia: {
    manager: "0x2f557407E27027e9ec580A30FD9cdB2317a41d3F",
    ballot: "0x71E7Dc3B83C6600a5Af51e658f03646071bF2E92"
  }
}

export const manager_abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_postalAddress",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "fallback",
    "stateMutability": "payable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "convertLotSharesToToken",
    "inputs": [
      {
        "name": "_lotId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createGMSharesToken",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAddingLotIsLocked",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBallotAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCustomerDetail",
    "inputs": [
      {
        "name": "_customerAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Customer",
        "components": [
          {
            "name": "isRegistered",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "lastName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "firstName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "lotId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficialNumber",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCustomersInfos",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct CustomerView[]",
        "components": [
          {
            "name": "isRegistered",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "lastName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "firstName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "customerAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "lotId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficialNumber",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCustomersList",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getERC20Address",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getERC20isLocked",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGeneralInfos",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct CondoGeneralInfo",
        "components": [
          {
            "name": "condoName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "postalAddress",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLotById",
    "inputs": [
      {
        "name": "_lotId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Lot",
        "components": [
          {
            "name": "customerAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "shares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficialNumber",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isTokenized",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLotsInfos",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct LotView[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "customerAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "shares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficialNumber",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "lastName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "firstName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "isTokenized",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNbOfCustomers",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNbOfLots",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getsDeployERC20IsPossible",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "linkCustomerToLot",
    "inputs": [
      {
        "name": "_customerAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_lotId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "loadSharesAndCustomersToBallot",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "openTokenizingOfShares",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerCustomer",
    "inputs": [
      {
        "name": "_firstName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_lastName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_customerAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerLot",
    "inputs": [
      {
        "name": "_lotOfficialNumber",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_shares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setGMBallotAddress",
    "inputs": [
      {
        "name": "_ballotAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CustomerCreated",
    "inputs": [
      {
        "name": "customerAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "firstName",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "lastName",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CustomerOfLotSet",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "customer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ERC20Deployed",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ERC20DeployedIsPossible",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogDepositReceived",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LotAdded",
    "inputs": [
      {
        "name": "condoLotId",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TotalSharesReachedMaxLimit",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CondoGmManager__AddressCantBeZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__CantDeployAnotherBallot",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__CantDeployAnotherERC20",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__CustomerAlreadyRegistered",
    "inputs": [
      {
        "name": "customer",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__CustomerHasAlreadyLot",
    "inputs": [
      {
        "name": "customer",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__CustomerNotFound",
    "inputs": [
      {
        "name": "customerAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__DeployBallotConditionsNotReached",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__DeployERC20ConditionsNotReached",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__ERC20NotDeployedYet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__EmptyString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondoGmManager__LotAlreadyHasOwner",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "customerAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__LotAlreadyRegistered",
    "inputs": [
      {
        "name": "lotOfficialNumber",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__LotNotFound",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__LotSharesAlreadyTokenized",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__RegisteredLotIsLocked",
    "inputs": [
      {
        "name": "lotOfficialNumber",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__SharesCantBeZero",
    "inputs": [
      {
        "name": "lotOfficialNumber",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__TotalSharesExceedsMaxLimit",
    "inputs": [
      {
        "name": "lotOfficialNumber",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__Unauthorized",
    "inputs": [
      {
        "name": "unauthorizedVoter",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondoGmManager__VotersAlreadyImported",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];

export const token_abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_symbol",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_condoTotalShares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentStatus",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum TokenWorkflowStatus"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGeneralInfo",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct TokenGeneralInfo",
        "components": [
          {
            "name": "condoTotalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "nbOfTokenizedLots",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "sharesTokenized",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "currentStatus",
            "type": "uint8",
            "internalType": "enum TokenWorkflowStatus"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialMinting",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "openTokenizingOfShares",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MaxSharesTokenizingReached",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ShareTokenized",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "shares",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokenizingSharesOpen",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ERC20InsufficientAllowance",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InsufficientBalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSpender",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__AmountExceededTotalSupply",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__Cant",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__ContractLocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__InitialMintingDone",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__InvalidInitialMintingAmount",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__InvalidMintingRecipient",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__InvalidPeriod",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMSharesToken__MintInitialAmountFirst",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__RecipientCantHaveTwoLots",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMSharesToken__TokenizedSharesMustBeNull",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];

export const ballot_abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_managerAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCurrentMinimalProposal",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MinimalProposalView",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentProposalBeingVoted",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentProposalComplete",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ProposalView",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "votingResult",
            "type": "uint8",
            "internalType": "enum VotingResult"
          },
          {
            "name": "approvals",
            "type": "tuple[]",
            "internalType": "struct MinVoter[]",
            "components": [
              {
                "name": "firstName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "lastName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "shares",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "lotOfficialNumber",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "approvalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "refusals",
            "type": "tuple[]",
            "internalType": "struct MinVoter[]",
            "components": [
              {
                "name": "firstName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "lastName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "shares",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "lotOfficialNumber",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "refusalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "blankVotes",
            "type": "tuple[]",
            "internalType": "struct MinVoter[]",
            "components": [
              {
                "name": "firstName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "lastName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "shares",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "lotOfficialNumber",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "blankVotesShares",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentStatus",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum BallotWorkflowStatus"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMinimalProposals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct MinimalProposalView[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNbOfProposals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNextProposalId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProposal",
    "inputs": [
      {
        "name": "_proposalId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Proposal",
        "components": [
          {
            "name": "isRegistered",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "votingResult",
            "type": "uint8",
            "internalType": "enum VotingResult"
          },
          {
            "name": "approvals",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "approvalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "refusals",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "refusalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "blankVotes",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "blankVotesShares",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProposalsComplete",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ProposalView[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "votingResult",
            "type": "uint8",
            "internalType": "enum VotingResult"
          },
          {
            "name": "approvals",
            "type": "tuple[]",
            "internalType": "struct MinVoter[]",
            "components": [
              {
                "name": "firstName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "lastName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "shares",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "lotOfficialNumber",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "approvalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "refusals",
            "type": "tuple[]",
            "internalType": "struct MinVoter[]",
            "components": [
              {
                "name": "firstName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "lastName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "shares",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "lotOfficialNumber",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "refusalShares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "blankVotes",
            "type": "tuple[]",
            "internalType": "struct MinVoter[]",
            "components": [
              {
                "name": "firstName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "lastName",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "shares",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "lotOfficialNumber",
                "type": "string",
                "internalType": "string"
              }
            ]
          },
          {
            "name": "blankVotesShares",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getVoter",
    "inputs": [
      {
        "name": "_voter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Voter",
        "components": [
          {
            "name": "tokenVerified",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "firstName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "lastName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "shares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficialNumber",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "votedProposalIds",
            "type": "uint256[]",
            "internalType": "uint256[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getVotersOfCurrentProposal",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lockContract",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerVoter",
    "inputs": [
      {
        "name": "_customerAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_customerFirstName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_customerLastName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_lotOfficialNumber",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_shares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCurrentProposalVotingCountReveal",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setERC20Address",
    "inputs": [
      {
        "name": "_tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setProposalBeingDiscussedStatusOrEndBallot",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setProposalVotingOpenStatus",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setProposalsSubmittingClosed",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitProposal",
    "inputs": [
      {
        "name": "_description",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "voteForCurrentProposal",
    "inputs": [
      {
        "name": "_voteEnum",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ContractWasLocked",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MeetingEnded",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalRegistered",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalVoteCountBeingRevealed",
    "inputs": [
      {
        "name": "proposalId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProposalVotingOpen",
    "inputs": [
      {
        "name": "proposalId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "GMBallot__AlreadyVotedForThisProposal",
    "inputs": [
      {
        "name": "proposalId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "voter",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMBallot__ContractLocked",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__DescriptionCantBeEmpty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__InexistentVoteType",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__InvalidPeriod",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__LastProposalNotRevealedYet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__LastProposalStillBeingHandled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__OnlyCustomerAuthorized",
    "inputs": [
      {
        "name": "unauthorized",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMBallot__OnlyManagerAuthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__ProposalIdNotFound",
    "inputs": [
      {
        "name": "proposalId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMBallot__ProposalsAreEmpty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__RegisterVotersFirst",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__SharesCantBeZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__TokenAlreadyRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "GMBallot__Unauthorized",
    "inputs": [
      {
        "name": "unauthorizedVoter",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "GMBallot__VotingForWrongProposalId",
    "inputs": [
      {
        "name": "proposalId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];