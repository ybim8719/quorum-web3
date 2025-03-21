import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAddCustomer, useAddLot, useLinkCustomerToLot } from "../hooks/useWriteActions.ts";
import { useWalletQueries } from "../hooks/useWalletQueries";
import AddCustomerInput from "./shared/Customers/AddCustomerInput";
import CustomersList from "./shared/Customers/CustomersList";
import LotsList from "./shared/Lots/LotsList";
import AddLotInput from "./shared/Lots/AddLotInput";
import LinkCustomerToLotInput from "./shared/CustomerToLot/LinkCustomerToLotInput.tsx";


import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { Modal } from "./UI/Modal";

import { Lot } from "../models/Lots";
import { CustomerProfile } from "../models/customers";


function AdminHome() {
    const { address } = useAccount();
    const { useFetchedCustomers, useFetchedLots } = useWalletQueries();
    // read hooks 
    const { data: fetchedCustomersData, error: fetchedCustomersError, isPending: fetchStatusIsPending, refetch: refetchCustomers } = useFetchedCustomers;
    const { data: fetchedLotsData, error: fetchedLotsError, isPending: fetchedLotsIsPending, refetch: refetchLots } = useFetchedLots;
    // write hooks 
    const { hash: addCustomerHash, error: addCustomerError, isConfirming: addCustomerIsConfirming, isConfirmed: addCustomerIsConfirmed, addCustomerWrite } = useAddCustomer();
    const { hash: addLotHash, error: addLotError, isConfirming: addLotIsConfirming, isConfirmed: addLotIsConfirmed, addLotWrite } = useAddLot();
    const { hash: linkCustomerToLotHash, error: linkCustomerToLotError, isConfirming: linkCustomerToLotIsConfirming, isConfirmed: linkCustomerToLotIsConfirmed, linkCustomerToLotWrite } = useLinkCustomerToLot();
    // states
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [lotIdBeingLinked, setLotIdBeingLinked] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // add customer tx reload fetch of customers list
    useEffect(() => {
        const refreshCustomersInfo = async () => {
            await refetchCustomers();
        };
        refreshCustomersInfo();
    }, [addCustomerIsConfirmed]);


    useEffect(() => {
        const refreshLotsInfo = async () => {
            await refetchLots();
        };
        refreshLotsInfo();
    }, [addLotIsConfirmed]);


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
            addCustomerWrite(firstName, lastName, customerAddress, address);
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
            addLotWrite(officialCode, shares, address);
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
        } catch (err) {
            setError("OUPS");
        }
        setIsLoading(false);
    };

    const openLinkModal = (lotId: number) => {
        setLotIdBeingLinked(lotId);
    }

    // triger link customer to lot tx
    const linkCustomerToLotHandler = async (customerAddress: string, lotId: number) => {
        try {
            setIsLoading(true);
            linkCustomerToLotWrite(customerAddress, lotId, address);
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
            <div>
                <div className="flex-wrapper">
                    <CustomersList customers={customers} />
                    <AddCustomerInput onValidate={addCustomerHandler} />
                </div>
            </div>
            <div>
                <div className="flex-wrapper">
                    <LotsList lots={lots} onLink={openLinkModal} />
                    <AddLotInput onValidate={addLotHandler} />
                </div>
            </div>
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

export default AdminHome;