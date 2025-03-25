import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAddCustomer, useAddLot, useLinkCustomerToLot } from "../hooks/useWriteActions.ts";
import { useReadManagerQueries } from "../hooks/useReadManagerQueries.ts";
import AddCustomerInput from "../components/shared/Customers/AddCustomerInput";
import CustomersList from "../components/shared/Customers/CustomersList";
import LotsList from "../components/shared/Lots/LotsList";
import AddLotInput from "../components/shared/Lots/AddLotInput";
import LinkCustomerToLotInput from "../components/shared/CustomerToLot/LinkCustomerToLotInput.tsx";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import ErrorBlock from "../components/UI/ErrorBlock";
import { Modal } from "../components/UI/Modal";

import { Lot } from "../models/Lots";
import { CustomerProfile } from "../models/customers";
import { UserContext } from "../context/userContext.tsx";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles.ts";


function Home() {
    const { address: connectedAccount, isConnected } = useAccount();
    const { useFetchedCustomers, useFetchedLots } = useReadManagerQueries();
    const userCtx = useContext(UserContext);
    // read hooks 
    const { data: fetchedCustomersData, error: fetchedCustomersError, refetch: refetchCustomers } = useFetchedCustomers;
    const { data: fetchedLotsData, error: fetchedLotsError, refetch: refetchLots } = useFetchedLots;
    // write hooks 
    const { hash: addCustomerHash, error: addCustomerError, isConfirmed: addCustomerIsConfirmed, addCustomerWrite } = useAddCustomer();
    const { hash: addLotHash, error: addLotError, isConfirmed: addLotIsConfirmed, addLotWrite } = useAddLot();
    const { hash: linkCustomerToLotHash, error: linkCustomerToLotError, isConfirmed: linkCustomerToLotIsConfirmed, linkCustomerToLotWrite } = useLinkCustomerToLot();
    // states
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    // modal & errors
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [openCreateErc20Modal, setOpenCreateErc20Modal] = useState<boolean>(false);
    const [lotIdBeingLinked, setLotIdBeingLinked] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isConnected) {
        return <h1>Please connect your wallet first</h1>
    }

    if (userCtx.role !== OWNER_ROLE && userCtx.role !== CUSTOMER_ROLE) {
        return <h1>Unauthorized</h1>
    }

    // add customer tx triggers refetch of customers list
    // useEffect(() => {
    //     const refreshCustomersInfo = async () => {
    //         await refetchCustomers();
    //     };
    //     refreshCustomersInfo();
    // }, [addCustomerIsConfirmed]);

    // // add customer tx triggers refetch of lots list
    // useEffect(() => {
    //     const refreshLotsInfo = async () => {
    //         await refetchLots();
    //     };
    //     refreshLotsInfo();
    // }, [addLotIsConfirmed]);

    // // set a ref to see changes
    // useEffect(() => {
    //     const refreshAll = async () => {
    //         await refetchLots();
    //         await refetchCustomers();
    //     };
    //     refreshAll();
    // }, [linkCustomerToLotIsConfirmed]);

    // 
    // useEffect(() => {
    //     if (fetchedCustomersData !== undefined && fetchedCustomersData !== null) {
    //         console.log(typeof fetchedCustomersData, "fetchedCustomersData");
    //         // setCustomers(fetchedCustomersData.toString());
    //         // adapt to js format
    //         // adapt tokenized property of lot
    //     }
    // }, [fetchedCustomersData, fetchedLotsData]);

    // triger add customer tx
    const addCustomerHandler = async (firstName: string, lastName: string, customerAddress: string) => {
        try {
            setIsLoading(true);
            addCustomerWrite(firstName, lastName, customerAddress, connectedAccount);
            setIsLoading(false);
        } catch (err) {
            setError("OUPS");
        }
        setIsLoading(false);
    };

    // triger add lot tx
    const addLotHandler = async (officialCode: string, shares: number) => {
        try {
            setIsLoading(true);
            addLotWrite(officialCode, shares, connectedAccount);
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
        } catch (err) {
            setError("OUPS");
        }
        setIsLoading(false);
    };

    //  set an id of lot to be linked to customer
    const openLinkLotModal = (lotId: number) => {
        setLotIdBeingLinked(lotId);
    }

    // triger link customer to lot tx
    const linkCustomerToLotHandler = async (customerAddress: string, lotId: number) => {
        try {
            setIsLoading(true);
            linkCustomerToLotWrite(customerAddress, lotId, connectedAccount);
            setIsLoading(false);
            setLotIdBeingLinked(null);
            setModalInfoText("Transaction confirmed");
        } catch (err) {
            setError("OUPS");
        }
        setIsLoading(false);
    }

    // triger link customer to lot tx
    const createERC20Handler = async () => {
        try {
            setIsLoading(true);
            // tx create token
            setIsLoading(false);
            setModalInfoText("Transaction confirmed. Check ERC20 page");
        } catch (err) {
            setError("OUPS");
        }
        setIsLoading(false);
    }

    let showCreateERC20Btn = false;
    if (!userCtx.erc20Address) {
        if (lots.length > 0) {
            let lotsCompleted = true;
            lots.forEach((l) => {
                if (l.customer === undefined || l.customer.address !== "") {
                    lotsCompleted = false;
                }
            })
            if (lotsCompleted) {
                showCreateERC20Btn = true;
            }
        }
    }


    return (
        <>
            <h1>
                <i className="nes-icon coin is-large"></i>
                <u>Lots and Customers</u>
            </h1>
            {showCreateERC20Btn && <button onClick={() => setOpenCreateErc20Modal(true)}>CREATE ERC20</button>}
            {openCreateErc20Modal &&
                <Modal onClose={() => setOpenCreateErc20Modal(false)}>
                    <div>Créer un ERC unique.</div>
                    <button onClick={createERC20Handler}>GO</button>
                </Modal>
            }
            <hr />
            <CustomersList customers={customers} />
            <hr />
            <AddCustomerInput onValidate={addCustomerHandler} />
            <hr />
            <LotsList lots={lots} onLink={openLinkLotModal} />
            <hr />
            <AddLotInput onValidate={addLotHandler} />
            {error && (
                <Modal onClose={() => setError(null)}>
                    <ErrorBlock title="OUPS" message={error} />
                </Modal>
            )}
            {modalInfoText && (
                <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>
            )}
            {isLoading && <LoadingIndicator />}
            {lotIdBeingLinked && (
                <Modal onClose={() => setLotIdBeingLinked(null)}>
                    <LinkCustomerToLotInput onCreateLink={linkCustomerToLotHandler} freeCustomers={customers.filter((c) => c.lot === null)} lot={lots.find((l) => l.id === lotIdBeingLinked)} />
                </Modal>
            )}
        </>
    );
}

export default Home;