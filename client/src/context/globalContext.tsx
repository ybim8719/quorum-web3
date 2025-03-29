import React, { createContext, useState } from "react";
import { UNAUTHORIZED_ROLE } from "../models/roles";
import { network } from "../../constants/deployed";

type GlobalContextType = {
  role: string;
  owner: string;
  customersAddresses: string[];
  erc20Address: string;
  deployedManagerAddress: string;
  erc20Status: number | null;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  setCustomersAddresses: React.Dispatch<React.SetStateAction<string[]>>;
  setErc20Address: React.Dispatch<React.SetStateAction<string>>;
  setErc20Status: React.Dispatch<React.SetStateAction<number | null>>;

};

export const GlobalContext = createContext<GlobalContextType>(
  null as unknown as GlobalContextType,
);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const GlobalContextProvider = ({ children }: ContextProviderProps) => {
  const [role, setRole] = useState<string>(UNAUTHORIZED_ROLE);
  const [erc20Address, setErc20Address] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [customersAddresses, setCustomersAddresses] = useState<string[]>([]);
  const deployedManagerAddress = network.anvil;
  const [erc20Status, setErc20Status] = useState<number | null>(null);

  const value = {
    role,
    owner,
    customersAddresses,
    erc20Address,
    deployedManagerAddress,
    erc20Status,
    setRole,
    setOwner,
    setCustomersAddresses,
    setErc20Address,
    setErc20Status
  };

  return (
    <GlobalContext.Provider value={value}> {children} </GlobalContext.Provider>
  );
};
