export type CustomerProfile = {
    address: string;
    firstName: number;
    lastName: number;
    lot: {
        id: number;
        lotOfficialCode: string;
        shares: number;
    };
};