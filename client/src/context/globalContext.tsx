import React, { createContext, useState } from "react";
import { UNAUTHORIZED_ROLE } from "../models/roles";
import { network } from "../../constants/deployed";

type GlobalContextType = {
  role: string;
  owner: string;
  customersAddresses: string[];
  deployedManagerAddress: string;
  erc20Address: string;
  erc20Status: string | null;
  deployedBallotAddress: string;
  ballotStatus: string | null;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  setCustomersAddresses: React.Dispatch<React.SetStateAction<string[]>>;
  setErc20Address: React.Dispatch<React.SetStateAction<string>>;
  setErc20Status: React.Dispatch<React.SetStateAction<string | null>>;
  setBallotStatus: React.Dispatch<React.SetStateAction<string | null>>;
};

export const GlobalContext = createContext<GlobalContextType>(
  null as unknown as GlobalContextType,
);

type ContextProviderProps = {
  children: React.ReactNode;
};


const NETWORK_TYPE = "sepolia";
// const NETWORK_TYPE = "sepolia";

export const GlobalContextProvider = ({ children }: ContextProviderProps) => {
  const [role, setRole] = useState<string>(UNAUTHORIZED_ROLE);
  const [erc20Address, setErc20Address] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [customersAddresses, setCustomersAddresses] = useState<string[]>([]);
  const deployedManagerAddress = network[NETWORK_TYPE].manager;
  const deployedBallotAddress = network[NETWORK_TYPE].ballot;

  const [erc20Status, setErc20Status] = useState<string | null>(null);
  const [ballotStatus, setBallotStatus] = useState<string | null>(null);

  const value = {
    role,
    owner,
    customersAddresses,
    deployedManagerAddress,
    deployedBallotAddress,
    erc20Address,
    erc20Status,
    ballotStatus,
    setRole,
    setOwner,
    setCustomersAddresses,
    setErc20Address,
    setErc20Status,
    setBallotStatus
  };

  return (
    <GlobalContext.Provider value={value}> {children} </GlobalContext.Provider>
  );
};
