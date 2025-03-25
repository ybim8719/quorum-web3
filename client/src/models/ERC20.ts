export const adressZero = "0x0000000000000000000000000000000000000000";

export const isNullAddress = (addressToCompare: string) => {
    return addressToCompare === adressZero;
}