import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAddCustomer, useAddLot, useLinkCustomerToLot } from "../hooks/useWriteActions.ts";
import { useWalletQueries } from "../hooks/useWalletQueries";
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


function Home() {
    const { address: connectedAccount } = useAccount();
    const { useFetchedCustomers, useFetchedLots } = useWalletQueries();
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
    const [lotIdBeingLinked, setLotIdBeingLinked] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // add customer tx triggers refetch of customers list
    useEffect(() => {
        const refreshCustomersInfo = async () => {
            await refetchCustomers();
        };
        refreshCustomersInfo();
    }, [addCustomerIsConfirmed]);

    // add customer tx triggers refetch of lots list
    useEffect(() => {
        const refreshLotsInfo = async () => {
            await refetchLots();
        };
        refreshLotsInfo();
    }, [addLotIsConfirmed]);

    useEffect(() => {
        const refreshAll = async () => {
            await refetchLots();
            await refetchCustomers();
        };
        refreshAll();
    }, [linkCustomerToLotIsConfirmed]);

    // 
    useEffect(() => {

        if (fetchedCustomersData !== undefined && fetchedCustomersData !== null) {
            console.log(typeof fetchedCustomersData, "fetchedCustomersData");
            // setCustomers(fetchedCustomersData.toString());
        }
    }, [fetchedCustomersData, fetchedLotsData]);

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
    const openLinkModal = (lotId: number) => {
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


    return (
        <>
            <h1>
                <i className="nes-icon coin is-large"></i>
                <u>Lots and Customers</u>
            </h1>
            <CustomersList customers={customers} />
            <AddCustomerInput onValidate={addCustomerHandler} />
            <LotsList lots={lots} onLink={openLinkModal} />
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
                    <LinkCustomerToLotInput onCreateLink={linkCustomerToLotHandler} customers={customers} lot={lots.find((l) => l.id === lotIdBeingLinked)} />
                </Modal>
            )}
        </>
    );
}

export default Home;