export const SEPOLIA_FACTORY_ADRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ANVIL_FACTORY_ADRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";



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
    "type": "function",
    "name": "convertSharesToToken",
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
    "name": "createGMBallot",
    "inputs": [],
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
            "name": "wallet",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "lotId",
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
    "name": "getErc20Address",
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
    "name": "verifyLotIsTokenized",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "CondoGmManager__LotHasNoCustomer",
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
]