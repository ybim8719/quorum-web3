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
          <td className="">
            {l.lotOfficialNumber} (id: {l.id})
          </td>
          <td className="">{l.shares}</td>
          <td className="">
            {l.customer
              ? `${l.customer.firstName} ${l.customer.lastName}`
              : "N/A"}
          </td>
          <td className="">
            {l.customer ? `${l.customer.address.slice(0, 15)}...` : "N/A"}
          </td>
          <td>
            {l.customer == undefined ? (
              <button
                className="nes-btn is-success"
                onClick={() => onLink(l.id)}
              >
                Link to a customer
              </button>
            ) : (
              "N/A"
            )}
          </td>
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
    <div className="section">
      <i className="nes-pokeball"></i>
      <h2>
        <u>Registered Lots ({lots.length}) </u>
      </h2>
      <p>
        <u>Current Total Shares: {totalLotsShares}</u>
      </p>
      <table>
        <thead>
          <tr>
            <th className="">Lot Official Code</th>
            <th className="">Shares</th>
            <th className="">Owner</th>
            <th className="">Owner address </th>
            <th className="">Actions</th>
          </tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </table>
    </div>
  );
};

export default LotsList;
