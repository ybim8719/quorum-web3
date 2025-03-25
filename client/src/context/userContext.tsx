import React, { createContext, useState } from "react";
import { ADMIN_ROLE, UNAUTHORIZED_ROLE } from "../models/roles";

type UserContextType = {
  role: string;
  owner: string;
  customersAddresses: string[];
  erc20Address: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  setCustomersAddresses: React.Dispatch<React.SetStateAction<string[]>>;
  setErc20Address: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType>(
  null as unknown as UserContextType,
);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: ContextProviderProps) => {
  const [role, setRole] = useState<string>(UNAUTHORIZED_ROLE);
  const [erc20Address, setErc20Address] = useState<string>("");
  const [owner, setOwner] = useState<string>("")
  const [customersAddresses, setCustomersAddresses] = useState<string[]>([]);

  const value = {
    role,
    owner,
    customersAddresses,
    erc20Address,
    setRole,
    setOwner,
    setCustomersAddresses,
    setErc20Address
  };

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};
