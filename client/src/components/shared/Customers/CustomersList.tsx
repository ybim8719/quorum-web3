import { CustomerProfile } from "../../../models/customers";


interface ICustomerProfileProps {
    customers: CustomerProfile[];
}

const CustomersList = ({ customers }: ICustomerProfileProps) => {
    let tableBody;
    if (customers.length > 0) {
        tableBody = customers.map((c, i) => {
            return (
                <tr key={`customer-${i}`}>
                    <td className="">{c.firstName}</td>
                    <td className="">{c.lastName}</td>
                    <td className="">{c.address}</td>
                    <td className="">
                        {
                            c?.lot ?
                                <span >ID = {c.lot.id}/ CODE = {c.lot.lotOfficialCode} / SHARE = {c.lot.shares}</span> :
                                <span>RIEN </span>
                        }
                    </td>
                </tr>
            );
        });
    } else {
        tableBody = (
            <tr>
                <td colSpan={4}>No Customers registered yet</td>
            </tr>
        );
    }

    return (
        <div className="">
            <h3>
                <u>Registered Customers ({customers.length})</u>
            </h3>
            <i className="nes-ash"></i>
            <table>
                <thead>
                    <tr>
                        <th className="">FirstName</th>
                        <th className="">LastName</th>
                        <th className="">Address</th>
                        <th className="">Lot</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </table>
        </div >
    );
};

export default CustomersList;
