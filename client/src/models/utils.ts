const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const isZeroAddress = (addressToCompare: string) => {
    return addressToCompare === ADDRESS_ZERO;
};
