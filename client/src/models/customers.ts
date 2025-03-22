export type CustomerProfile = {
    address: string;
    firstName: number;
    lastName: number;
    lotIds?: {
        id: number;
        lotOfficialCode: string;
        shares: number;
    }[];
};