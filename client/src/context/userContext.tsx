import React, { createContext, useState } from "react";
import { ADMIN_ROLE } from "../models/roles";

type UserContextType = {
  role: string;
  isAuthorized: boolean;
  owner: string;
  customersAddresses: string[];
  erc20Address: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [role, setRole] = useState<string>(ADMIN_ROLE);
  const [erc20Address, setErc20Address] = useState<string>("");

  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [owner, setOwner] = useState<string>("")
  const [customersAddresses, setCustomersAddresses] = useState<string[]>([]);

  const value = {
    role,
    isAuthorized,
    owner,
    customersAddresses,
    erc20Address,
    setRole,
    setIsAuthorized,
    setOwner,
    setCustomersAddresses,
    setErc20Address
  };

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};
