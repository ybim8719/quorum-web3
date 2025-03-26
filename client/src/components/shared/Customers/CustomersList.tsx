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
                    <td className="">{c.address.slice(0, 15)}...</td>
                    <td className="">{c?.lotOfficialNumber ? c.lotOfficialNumber : "N/A"}</td>
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
        <div className="section">
            <i className="nes-ash"></i>
            <h3>
                <u>Registered Customers ({customers.length})</u>
            </h3>
            <table>
                <thead>
                    <tr>
                        <th className="">FirstName</th>
                        <th className="">LastName</th>
                        <th className="">Address</th>
                        <th className="">Lot Code</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </table>
        </div >
    );
};

export default CustomersList;
