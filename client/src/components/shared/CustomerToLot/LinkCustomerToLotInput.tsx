import { useState } from "react";
import { Lot } from "../../../models/lots";
import { CustomerProfile } from "../../../models/customers";


interface ILinkCustomerToLotInputProps {
    lot: Lot | undefined;
    freeCustomers: CustomerProfile[]
    onCreateLink: (customerAddress: string, lotId: number) => void;
}

const LinkCustomerToLotInput = ({
    lot,
    freeCustomers,
    onCreateLink,
}: ILinkCustomerToLotInputProps) => {
    const [selectedCustomer, setSelectedCustomer] = useState<string>("");
    if (freeCustomers.length === 0) {
        return <p>No Customers found</p>;
    }

    if (lot === undefined) {
        return <p>No lot found</p>;
    }
    function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        if (selectedCustomer !== "" && lot) {
            onCreateLink(selectedCustomer, lot.id);
        }
    }

    return (
        <div>
            <h2>LOT N°{lot.lotOfficialNumber}</h2>
            <p> ({lot.shares} tantièmes)</p>
            <form method="post" onSubmit={handleSubmit}>
                <label>Select a owner:
                    <select
                        defaultValue={""}
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                        <option value="" disabled>Select a Customer</option>
                        {freeCustomers.map((c) => {
                            return (
                                <option value={c.address} key={`customer-${c.address}`}>
                                    {c.firstName} {c.lastName}
                                </option>
                            );
                        })}
                    </select>
                </label>
                <br></br>
                <button className="nes-btn is-primary" type="submit">
                    Send Tx
                </button>
            </form>
        </div>
    );
};

export default LinkCustomerToLotInput;
