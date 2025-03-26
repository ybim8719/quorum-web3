import { Lot } from "../../../models/lots";


interface ITokenizedLotsProps {
    lots: Lot[];
    onVerify: (lotToVerify: Lot) => void;
    onTokenize: (lotToTokenize: Lot) => void;
}

const TokenizedLots = ({ lots, onVerify, onTokenize }: ITokenizedLotsProps) => {
    let tableBody;

    if (lots.length > 0) {
        tableBody = lots.map((l, i) => {
            let actions;
            if (l.isTokenized) {
                actions = <button onClick={() => onVerify(l)}>Verify authenticity</button>
            } else {
                actions = <button onClick={() => onTokenize(l)}>Tokenize now</button>
            }
            return (
                <tr key={`customer-${i}`}>
                    <td className="">{l.lotOfficialNumber} (id: {l.id})</td>
                    <td className="">{l.shares}</td>
                    <td className="">{l.customer && l.customer.firstName} / {l.customer && l.customer.lastName} / {l.customer && l.customer.address}</td>
                    <td className="">{l.isTokenized ? "yes" : "no"}</td>
                    <td>{actions}</td>
                </tr>
            );
        });
    } else {
        tableBody = (
            <tr>
                <td colSpan={5}>No Lots registered yet</td>
            </tr>
        );
    }

    return (
        <div className="">
            <h3>
                <u>Lots ({lots.length})</u>
            </h3>
            <p>Total shares : / 1000</p>
            <i className="nes-ash"></i>
            <table>
                <thead>
                    <tr>
                        <th className="">Lot Official Code</th>
                        <th className="">Shares</th>
                        <th className="">Customer </th>
                        <th className="">Is ERC20 ?</th>
                        <th className="">Action</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </table>
        </div >
    );
};

export default TokenizedLots;
