export type Lot = {
    id: number;
    lotOfficialCode: string;
    shares: number;
    customer?: {
        address: string;
        firstName: string;
        lastName: string;
    }
};