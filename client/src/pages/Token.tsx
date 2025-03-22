import { useContext } from "react";
import { UserContext } from "../context/userContext";


function ERC20() {
    const userCtx = useContext(UserContext);
    const erc20 = userCtx.erc20Address;
    if (!erc20) {
        return <p>NO ERC20 deployed yet</p>
    }

    return (
        <div>
            <h1>UnAuthorized</h1>
        </div>
    );
}

export default ERC20;