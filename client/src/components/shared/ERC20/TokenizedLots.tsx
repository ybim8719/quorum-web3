import { TOKEN_STATUS_INSTRUCTIONS, TRANSFERING_SHARES_KEY } from "../../../models/ERC20";
import { Lot } from "../../../models/lots";
import { CUSTOMER_ROLE, OWNER_ROLE } from "../../../models/roles";

interface ITokenizedLotsProps {
  lots: Lot[];
  role: string;
  balanceOfOwner: number;
  onVerify: (lotToVerify: Lot) => void;
  onTokenize: (lotToTokenize: Lot) => void;
}

const TokenizedLots = ({ lots, role, balanceOfOwner, onVerify, onTokenize }: ITokenizedLotsProps) => {
  let tableBody;
  if (lots.length > 0) {
    tableBody = lots.map((l, i) => {
      let actions;
      if (l.isTokenized) {
        actions = (
          <button className="nes-btn" onClick={() => onVerify(l)}>Verify authenticity</button>
        );
      } else {
        actions = <button className="nes-btn" onClick={() => onTokenize(l)}>Tokenize now</button>;
      }
      return (
        <tr key={`customer-${i}`}>
          <td className="">
            {l.lotOfficialNumber} (id: {l.id})
          </td>
          <td className="">{l.shares}</td>
          <td className="">
            {l.customer && l.customer.firstName} /{" "}
            {l.customer && l.customer.lastName} /{" "}
            {l.customer && `${l.customer.address.slice(0, 12)}...`}
          </td>
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
      {balanceOfOwner === 0 && <p>All shares went transfered to customers !</p>}
      <p><u>Desc: </u>{TOKEN_STATUS_INSTRUCTIONS[TRANSFERING_SHARES_KEY].description}</p>
      {role === OWNER_ROLE &&
        <p><u>Instructions: </u> {TOKEN_STATUS_INSTRUCTIONS[TRANSFERING_SHARES_KEY].ownerInstruction}</p>}
      {role === CUSTOMER_ROLE &&
        <p><u>Instructions: </u>{TOKEN_STATUS_INSTRUCTIONS[TRANSFERING_SHARES_KEY].customerInstruction}</p>}
      <p>On Owner's balance:{balanceOfOwner}/1000</p>
      <h3>
        <u>Lots ({lots.length})</u>
      </h3>
      <i className="nes-charmander"></i>
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
    </div>
  );
};

export default TokenizedLots;
