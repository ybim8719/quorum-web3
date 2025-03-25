import { Lot } from "../../../models/lots";

interface ILotProps {
    lots: Lot[];
    totalLotsShares: number;
    onLink: (id: number) => void;
}

const LotsList = ({ lots, totalLotsShares, onLink }: ILotProps) => {
    let tableBody;
    if (lots.length > 0) {
        tableBody = lots.map((l, i) => {
            return (
                <tr key={`customer-${i}`}>
                    <td className="">{l.lotOfficialNumber} (id: {l.id})</td>
                    <td className="">{l.shares}</td>
                    <td className="">{l.customer ? l.customer.firstName : "N/A"} {l.customer ? l.customer.lastName : "N/A"}</td>
                    <td className="">{l.customer ? l.customer.address : "N/A"}</td>
                    <td>{l.customer == undefined && <button onClick={() => onLink(l.id)}>Link to a customer</button>}</td>
                </tr>
            );
        });
    } else {
        tableBody = (
            <tr>
                <td colSpan={4}>No Lots registered yet</td>
            </tr>
        );
    }

    return (
        <div className="">
            <h3>
                <u>Registered Lots ({lots.length}) </u>
                <u>Total Shares: {totalLotsShares} </u>

            </h3>
            <i className="nes-ash"></i>
            <p>Total shares</p>
            <table>
                <thead>
                    <tr>
                        <th className="">lot Official Code</th>
                        <th className="">Shares</th>
                        <th className="">Owner</th>
                        <th className="">Owner address </th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </table>
        </div >
    );
};

export default LotsList;
