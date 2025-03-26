import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAddCustomer, useAddLot, useLinkCustomerToLot, useCreateERC20 } from "../hooks/useWriteActions.ts";
import { useReadManagerQueries } from "../hooks/useReadManagerQueries.ts";
import { UserContext } from "../context/userContext.tsx";
import { Lot, MAX_SHARES_LIMIT } from "../models/lots";
import { CustomerProfile } from "../models/customers";
import { OWNER_ROLE, CUSTOMER_ROLE } from "../models/roles.ts";
import { isNullAddress } from "../models/ERC20.ts";
import AddCustomerInput from "../components/shared/Customers/AddCustomerInput";
import CustomersList from "../components/shared/Customers/CustomersList";
import LotsList from "../components/shared/Lots/LotsList";
import AddLotInput from "../components/shared/Lots/AddLotInput";
import LinkCustomerToLotInput from "../components/shared/CustomerToLot/LinkCustomerToLotInput.tsx";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import ErrorBlock from "../components/UI/ErrorBlock";
import { Modal, NonClosableModal } from "../components/UI/Modal";



function Home() {
    const { address: connectedAccount, isConnected } = useAccount();
    const { useFetchedCustomers, useFetchedLots, useFetchedERC20Adress } = useReadManagerQueries();
    const userCtx = useContext(UserContext);
    // read hooks 
    const { data: fetchedCustomersData, refetch: refetchCustomers } = useFetchedCustomers;
    const { data: fetchedLotsData, refetch: refetchLots } = useFetchedLots;
    const { data: fetchedERC20AddressData, refetch: refetchERC20Address } = useFetchedERC20Adress;

    // write hooks 
    const { hash: addCustomerHash, error: addCustomerError, isConfirmed: addCustomerIsConfirmed, addCustomerWrite } = useAddCustomer();
    const { hash: addLotHash, error: addLotError, isConfirmed: addLotIsConfirmed, addLotWrite } = useAddLot();
    const { hash: linkCustomerToLotHash, error: linkCustomerToLotError, isConfirmed: linkCustomerToLotIsConfirmed, linkCustomerToLotWrite } = useLinkCustomerToLot();
    const { hash: createErc20Hash, error: createErc20Error, isConfirmed: createErc20IsConfirmed, useCreateERC20Write } = useCreateERC20();

    // states
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    // modal & errors
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [openCreateErc20Modal, setOpenCreateErc20Modal] = useState<boolean>(false);
    const [lotIdBeingLinked, setLotIdBeingLinked] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentHash, setCurrentHash] = useState<string | null>(null);


    useEffect(() => {
        if (fetchedCustomersData !== undefined && fetchedCustomersData !== null && fetchedLotsData !== undefined && fetchedLotsData !== null) {
            if (Array.isArray(fetchedCustomersData) && fetchedCustomersData.length > 0) {
                const formatedCustomers = fetchedCustomersData.map((fetchedCustomer) => {
                    let formatedCustomer: CustomerProfile = {
                        address: fetchedCustomer.customerAddress,
                        firstName: fetchedCustomer.firstName,
                        lastName: fetchedCustomer.lastName,
                    }
                    if (fetchedCustomer.lotOfficialNumber !== "") {
                        formatedCustomer.lotOfficialNumber = fetchedCustomer.lotOfficialNumber
                    }
                    if (Number(fetchedCustomer.lotId) > 0) {
                        formatedCustomer.lotId = Number(fetchedCustomer.lotId);
                    }
                    return formatedCustomer;
                })
                setCustomers(formatedCustomers);
            }
            if (Array.isArray(fetchedLotsData) && fetchedLotsData.length > 0) {
                const formatedLots = fetchedLotsData.map((lot) => {
                    let formatedLot: Lot = {
                        id: Number(lot.id),
                        shares: Number(lot.shares),
                        isTokenized: lot.isTokenized,
                        lotOfficialNumber: lot.lotOfficialNumber
                    }
                    if (isNullAddress(lot.customerAddress) === false) {
                        formatedLot.customer = {
                            address: lot.customerAddress,
                            firstName: lot.firstName,
                            lastName: lot.lastName,
                        }
                    }
                    return formatedLot;
                })
                setLots(formatedLots);
            }
        }
    }, [fetchedCustomersData, fetchedLotsData]);

    // tx successes refetch customers and lots lists
    useEffect(() => {
        // fetch of data worked = true
        if (addCustomerIsConfirmed || addLotIsConfirmed || linkCustomerToLotIsConfirmed) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
        }
        const refreshAll = async () => {
            await refetchLots();
            await refetchCustomers();
        };
        refreshAll();
    }, [addCustomerIsConfirmed, addLotIsConfirmed, linkCustomerToLotIsConfirmed]);

    // error in transaction / open error modal
    useEffect(() => {
        if (addCustomerError || addLotError || linkCustomerToLotError) {
            setIsLoading(false);
            setError("Transaction failed");
        }
    }, [addCustomerError, addLotError, linkCustomerToLotError]);


    useEffect(() => {
        console.log('er20 created')
    }, [createErc20IsConfirmed]);

    useEffect(() => {
        console.log('er20 address', fetchedERC20AddressData)
    }, [fetchedERC20AddressData]);



    // triger add customer tx
    const addCustomerHandler = async (firstName: string, lastName: string, customerAddress: string) => {
        setIsLoading(true);
        await addCustomerWrite(firstName, lastName, customerAddress, connectedAccount);
    };

    // triger add lot tx
    const addLotHandler = async (officialCode: string, shares: number) => {
        setIsLoading(true);
        await addLotWrite(officialCode, shares, connectedAccount);
    };

    //  set an id of lot to be linked to customer
    const openLinkLotModal = (lotId: number) => {
        setLotIdBeingLinked(lotId);
    }

    // triger link customer to lot tx
    const linkCustomerToLotHandler = async (customerAddress: string, lotId: number) => {
        setIsLoading(true);
        await linkCustomerToLotWrite(customerAddress, lotId, connectedAccount);
        setLotIdBeingLinked(null);
    }

    // triger link customer to lot tx
    const createERC20Handler = async () => {
        setIsLoading(true);
        // tx create token
        setModalInfoText("Transaction confirmed. Check ERC20 page");
    }

    if (!isConnected) {
        return <h1>Please connect your wallet first</h1>
    }

    if (userCtx.role !== OWNER_ROLE && userCtx.role !== CUSTOMER_ROLE) {
        return <h1>Unauthorized</h1>
    }

    const totalLotsShares = lots.reduce(
        (accumulator, currentValue) => accumulator + currentValue.shares,
        0,
    );

    let showCreateERC20Btn = false;
    if (!userCtx.erc20Address && totalLotsShares === MAX_SHARES_LIMIT) {
        if (lots.length > 0) {
            let lotsCompleted = true;
            lots.forEach((l) => {
                if (l.hasOwnProperty('customer') === false) {
                    lotsCompleted = false;
                }
            })
            if (lotsCompleted) {
                showCreateERC20Btn = true;
            }
        }
    }

    // array of modals
    let modals = []
    if (error) {
        modals.push(
            <Modal onClose={() => setError(null)}>
                <ErrorBlock title="OUPS" message={error} />
            </Modal>)
    }
    if (modalInfoText) {
        modals.push(<Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>)
    }

    if (isLoading) {
        modals.push(<NonClosableModal><>
            <h2>Transaction being processed</h2>
            <LoadingIndicator />
        </></NonClosableModal>)
    }

    if (lotIdBeingLinked) {
        modals.push(<Modal onClose={() => setLotIdBeingLinked(null)}>
            <LinkCustomerToLotInput onCreateLink={linkCustomerToLotHandler} freeCustomers={customers.filter((c) => c.hasOwnProperty('lotId') === false)} lot={lots.find((l) => l.id === lotIdBeingLinked)} />
        </Modal>)
    }

    if (openCreateErc20Modal) {
        modals.push(
            <Modal onClose={() => setOpenCreateErc20Modal(false)}>
                <div>Créer un ERC unique.</div>
                <button className="nes-btn is-success" onClick={createERC20Handler}>GO</button>
                <br></br>
            </Modal>
        )
    }

    return (
        <>
            <h1>
                <i className="nes-icon coin is-large"></i>
                <u>Home</u>
            </h1>
            <p>Welcome, dear {userCtx.role} !</p>
            {showCreateERC20Btn && <button className="nes-btn is-success" onClick={() => setOpenCreateErc20Modal(true)}>GO CREATE ERC20 !</button>}
            <CustomersList customers={customers} />
            <hr />
            {userCtx.role === OWNER_ROLE && <><AddCustomerInput onValidate={addCustomerHandler} /> <hr /></>}
            <LotsList totalLotsShares={totalLotsShares} lots={lots} onLink={openLinkLotModal} />
            {userCtx.role === OWNER_ROLE && <><AddLotInput onValidate={addLotHandler} remainingSharesToGrant={MAX_SHARES_LIMIT - totalLotsShares} /> <hr /></>}
            {modals}
        </>
    );
}

export default Home;