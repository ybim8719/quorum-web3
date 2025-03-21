export type Lot = {
    lotOfficialCode: string;
    shares: number;
    customer?: {
        address: string;
        firstName: string;
        lastName: string;
    }
};