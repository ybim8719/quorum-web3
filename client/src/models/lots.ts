export type Lot = {
  id: number;
  lotOfficialNumber: string;
  shares: number;
  isTokenized: boolean;
  customer?: {
    address: string;
    firstName: string;
    lastName: string;
  };
};

export const MAX_SHARES_LIMIT = 1000;
