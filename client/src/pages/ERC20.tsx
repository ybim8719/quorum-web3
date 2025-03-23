import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { Modal } from "../components/UI/Modal";
import LoadingIndicator from "../components/UI/LoadingIndicator";


function ERC20() {
    const userCtx = useContext(UserContext);
    const erc20 = userCtx.erc20Address;
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);

    if (!erc20) {
        return <p>NO ERC20 deployed yet</p>
    }
    // table of lots with lotinfo + customer attached + btn transfert / or verify to get the token contract directly

    // button close status 
    return (
        <div>
            <h1>TOKEN</h1>
            <p>CURRENT Status: XXXX</p>
            <p>Total shares transformed to token /1000 </p>

            {modalInfoText && (
                <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>
            )}
            {/* {isLoading && <LoadingIndicator />} */}
        </div>
    );
}

export default ERC20;