// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

enum TokenWorkflowStatus {
    InitialMinting,
    TransferingShares,
    ContractLocked
}

struct TokenGeneralInfo {
    uint256 condoTotalShares;
    uint256 nbOfTokenizedLots;
    uint256 sharesTokenized;
    TokenWorkflowStatus currentStatus;
}
