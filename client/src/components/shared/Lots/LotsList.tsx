import { Lot } from "../../../models/Lots";


interface ILotProps {
    lots: Lot[];
    onLink: (id: number) => void;
}

const LotsList = ({ lots, onLink }: ILotProps) => {
    let tableBody;
    if (lots.length > 0) {
        tableBody = lots.map((l, i) => {
            return (
                <tr key={`customer-${i}`}>
                    <td className="">{l.lotOfficialCode} (id: {l.id})</td>
                    <td className="">{l.shares}</td>
                    <td className="">{l.customer && l.customer.firstName}</td>
                    <td className="">{l.customer && l.customer.lastName}</td>
                    <td className="">{l.customer && l.customer.address}</td>
                    <td>{l.customer == undefined && <button onClick={() => onLink(l.id)}>Link a customer</button>}</td>
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
                <u>Registered Lots ({lots.length})</u>
            </h3>
            <i className="nes-ash"></i>
            <table>
                <thead>
                    <tr>
                        <th className="">lotOfficialCode</th>
                        <th className="">shares</th>
                        <th className="">owner firstName</th>
                        <th className="">owner lastName</th>
                        <th className="">owner address </th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </table>
        </div >
    );
};

export default LotsList;
