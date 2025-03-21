export const abi = [
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
      },
      {
        "name": "_maxAdminNb",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "convertSharesToToken",
    "inputs": [
      {
        "name": "customer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "gmId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createGM",
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
    "name": "getCustomerLots",
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
        "type": "tuple[]",
        "internalType": "struct CondominiumLot[]",
        "components": [
          {
            "name": "ownerAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "shares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficalNumber",
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
    "name": "getCustomersLength",
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
    "name": "getLotDetail",
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
        "internalType": "struct CondominiumLot",
        "components": [
          {
            "name": "ownerAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "shares",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lotOfficalNumber",
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
    "name": "modifyStatus",
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
    "name": "registeringAdmin",
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
        "name": "_adminAddress",
        "type": "address",
        "internalType": "address"
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
    "type": "event",
    "name": "AdminRegistered",
    "inputs": [
      {
        "name": "adminAddress",
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
    "name": "LotOwnerSet",
    "inputs": [
      {
        "name": "lotId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LotsAllRegistered",
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
    "type": "error",
    "name": "CondomGMFactory__AddressCantBeZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondomGMFactory__AdminAlreadyAdded",
    "inputs": [
      {
        "name": "adminAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondomGMFactory__AdminListFull",
    "inputs": [
      {
        "name": "adminAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CondomGMFactory__CustomerAlreadyRegistered",
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
    "name": "CondomGMFactory__CustomerNotFound",
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
    "name": "CondomGMFactory__EmptyString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CondomGMFactory__LotAlreadyHasOwner",
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
    "name": "CondomGMFactory__LotAlreadyRegistered",
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
    "name": "CondomGMFactory__LotNotFound",
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
    "name": "CondomGMFactory__RegisteredLotIsLocked",
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
    "name": "CondomGMFactory__TotalSharesExceedsMaxLimit",
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
    "name": "CondomGMFactory__Unauthorized",
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
