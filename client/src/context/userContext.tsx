import React, { createContext, useState } from "react";

type UserContextType = {
  role: string;
  username: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType>(
  null as unknown as UserContextType,
);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: ContextProviderProps) => {
  const [role, setRole] = useState("ADMIN");
  const [username, setUsername] = useState("MARCO");

  const value = {
    role,
    username,
    setRole,
    setUsername,
  };

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};
