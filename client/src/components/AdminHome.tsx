import { useState } from "react";
import AddCustomerInput from "./shared/Customers/AddCustomerInput";
import CustomersList from "./shared/Customers/CustomersList";
import { CustomerProfile } from "../models/customers";
import { Lot } from "../models/Lots";
import { Modal } from "./UI/Modal";
import LoadingIndicator from "./UI/LoadingIndicator";
import ErrorBlock from "./UI/ErrorBlock";
import { useAddCustomer } from "../hooks/useJobActions";

function AdminHome() {
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //     useEffect(() => {
    //         if (fetchedStatusData !== undefined && fetchedStatusData !== null) {
    //             console.log(typeof fetchedStatusData, "went");
    //             setStatus(fetchedStatusData.toString());
    //         }
    //     }, [fetchedStatusData]);

    //     const loadPage = async () => {
    //         await refetchLots();
    //         await refetchCustomers();
    //         // await getEvents();
    //     }

    //TO DO 
    // section of customers liste + add customers 
    // section of lots liste + add lots 
    // section d'association lot + customers
    // section of admin members 

    const { hash: hashTakeJob, error: errorTakeJob, isConfirming: isConfirmingTakeJob, isConfirmed: isConfirmedTakeJob, takeJob } = useAddCustomer(job.id, address);

    const addCustomerHandler = async (firstName: string, lastName: string, address: string) => {
        try {
            setIsLoading(true);
            // const txResponse = await contract.registerVoter(address);
            // await txResponse.wait(1);
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            // await loadVotersInfo(contract);
        }
        catch (err) {
            // setError("OUPS");
        }
        // setIsLoading(false);
    };


    return (
        <>
            <h1>
                <i className="nes-icon coin is-large"></i>
                <u>Lots and Customers</u>
            </h1>
            <button>LOAD CUSTOMER</button>
            <div>
                <div className="flex-wrapper">
                    <CustomersList customers={customers} />
                    <AddCustomerInput onValidate={addCustomerHandler} />
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

        </>
    );
}

export default AdminHome;