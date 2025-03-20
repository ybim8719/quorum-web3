import React, { createContext, useState } from "react";
import { ADMIN_ROLE } from "../models/roles";

type UserContextType = {
  role: string;
  isAuthorized: boolean;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext<UserContextType>(
  null as unknown as UserContextType,
);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: ContextProviderProps) => {
  const [role, setRole] = useState(ADMIN_ROLE);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const value = {
    role,
    isAuthorized,
    setRole,
    setIsAuthorized,
  };

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};
