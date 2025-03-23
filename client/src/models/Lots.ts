export type Lot = {
    id: number;
    lotOfficialCode: string;
    shares: number;
    tokenized: boolean;
    customer?: {
        address: string;
        firstName: string;
        lastName: string;
    }
};