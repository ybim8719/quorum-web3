import { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import {
    useAddCustomer,
    useAddLot,
    useLinkCustomerToLot,
    useCreateERC20,
} from "../hooks/useWriteActions.ts";
import { useReadManagerQueries } from "../hooks/useReadManagerQueries.ts";
import { GlobalContext } from "../context/globalContext.tsx";
import { Lot, MAX_SHARES_LIMIT } from "../models/lots";
import { CustomerProfile } from "../models/customers";
import { OWNER_ROLE, CUSTOMER_ROLE, TRANSACTIONS } from "../models/roles.ts";
import { isZeroAddress } from "../models/utils.ts";
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
    const globalCtx = useContext(GlobalContext);
    const { useFetchedCustomers, useFetchedLots, useFetchedERC20Adress } = useReadManagerQueries(globalCtx.deployedManagerAddress);
    // read hooks
    const { data: fetchedCustomersData, refetch: refetchCustomers } = useFetchedCustomers;
    const { data: fetchedLotsData, refetch: refetchLots } = useFetchedLots;
    const { data: fetchedERC20AddressData, refetch: refetchERC20Address } = useFetchedERC20Adress;
    // write hooks
    const {
        hash: addCustomerHash,
        error: addCustomerError,
        isConfirmed: addCustomerIsConfirmed,
        addCustomerWrite,
    } = useAddCustomer();
    const {
        hash: addLotHash,
        error: addLotError,
        isConfirmed: addLotIsConfirmed,
        addLotWrite,
    } = useAddLot();
    const {
        hash: linkCustomerToLotHash,
        error: linkCustomerToLotError,
        isConfirmed: linkCustomerToLotIsConfirmed,
        linkCustomerToLotWrite,
    } = useLinkCustomerToLot();
    const {
        hash: createErc20Hash,
        error: createErc20Error,
        isConfirmed: createErc20IsConfirmed,
        createERC20Write,
    } = useCreateERC20();
    let addCustomerHashRef = useRef(addCustomerHash);
    let addLotHashRef = useRef(addLotHash);
    let linkCustomerToLotHashRef = useRef(linkCustomerToLotHash);
    let createErc20HashRef = useRef(createErc20Hash);

    // states
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    // modal & errors
    const [modalInfoText, setModalInfoText] = useState<string | null>(null);
    const [openCreateErc20Modal, setOpenCreateErc20Modal] =
        useState<boolean>(false);
    const [lotIdBeingLinked, setLotIdBeingLinked] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentHash, setCurrentHash] = useState<string | null>(null);
    const [txBeingHandled, setTxBeingHandled] = useState<string | null>(null);

    useEffect(() => {
        if (
            fetchedCustomersData !== undefined &&
            fetchedCustomersData !== null &&
            fetchedLotsData !== undefined &&
            fetchedLotsData !== null
        ) {
            if (
                Array.isArray(fetchedCustomersData) &&
                fetchedCustomersData.length > 0
            ) {
                const formatedCustomers = fetchedCustomersData.map(
                    (fetchedCustomer) => {
                        let formatedCustomer: CustomerProfile = {
                            address: fetchedCustomer.customerAddress,
                            firstName: fetchedCustomer.firstName,
                            lastName: fetchedCustomer.lastName,
                        };
                        if (fetchedCustomer.lotOfficialNumber !== "") {
                            formatedCustomer.lotOfficialNumber =
                                fetchedCustomer.lotOfficialNumber;
                        }
                        if (Number(fetchedCustomer.lotId) > 0) {
                            formatedCustomer.lotId = Number(fetchedCustomer.lotId);
                        }
                        return formatedCustomer;
                    },
                );
                setCustomers(formatedCustomers);
            }
            if (Array.isArray(fetchedLotsData) && fetchedLotsData.length > 0) {
                const formatedLots = fetchedLotsData.map((lot) => {
                    let formatedLot: Lot = {
                        id: Number(lot.id),
                        shares: Number(lot.shares),
                        isTokenized: lot.isTokenized,
                        lotOfficialNumber: lot.lotOfficialNumber,
                    };
                    if (isZeroAddress(lot.customerAddress) === false) {
                        formatedLot.customer = {
                            address: lot.customerAddress,
                            firstName: lot.firstName,
                            lastName: lot.lastName,
                        };
                    }
                    return formatedLot;
                });
                setLots(formatedLots);
            }
        }
    }, [fetchedCustomersData, fetchedLotsData]);

    // tx successes => refetch customers and lots lists
    useEffect(() => {
        // fetch of data worked = true
        if (
            (addCustomerIsConfirmed && txBeingHandled === TRANSACTIONS.addCustomer) ||
            (addLotIsConfirmed && txBeingHandled === TRANSACTIONS.addLot) ||
            (linkCustomerToLotIsConfirmed && txBeingHandled === TRANSACTIONS.linkCustomerToLot)
        ) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            const refreshAll = async () => {
                await refetchLots();
                await refetchCustomers();
            };
            refreshAll();
        }

    }, [addCustomerIsConfirmed, addLotIsConfirmed, linkCustomerToLotIsConfirmed, createErc20IsConfirmed]);

    // error in tx / open error modal
    useEffect(() => {
        if (addCustomerError || addLotError || linkCustomerToLotError) {
            setIsLoading(false);
            setError("Transaction failed");
        }
    }, [addCustomerError, addLotError, linkCustomerToLotError, createErc20Error]);

    // deployment of ERC20 => triggers fetch of its address
    useEffect(() => {
        if (createErc20IsConfirmed && txBeingHandled === TRANSACTIONS.createERC20) {
            setIsLoading(false);
            setModalInfoText("Transaction confirmed");
            refetchERC20Address();
        }
    }, [createErc20IsConfirmed]);

    // when fetch of ERC20 address is done, setERC20 Address
    useEffect(() => {
        if (isZeroAddress(fetchedERC20AddressData as string) === false) {
            globalCtx.setErc20Address(fetchedERC20AddressData as string);
        }
    }, [fetchedERC20AddressData]);

    useEffect(() => {
        if ((addCustomerHash !== addCustomerHashRef.current) && addCustomerIsConfirmed === false) {
            setCurrentHash(addCustomerHash as string);
            addCustomerHashRef.current = addCustomerHash;
        }

        if ((addLotHash !== addLotHashRef.current) && addLotIsConfirmed === false) {
            setCurrentHash(addLotHash as string);
            addLotHashRef.current = addLotHash;
        }

        if ((linkCustomerToLotHash !== linkCustomerToLotHashRef.current) && linkCustomerToLotIsConfirmed === false) {
            setCurrentHash(linkCustomerToLotHash as string);
            linkCustomerToLotHashRef.current = linkCustomerToLotHash;
        }

        if ((createErc20Hash !== createErc20HashRef.current) && createErc20IsConfirmed === false) {
            setCurrentHash(createErc20Hash as string);
            createErc20HashRef.current = createErc20Hash;
        }
    }, [addCustomerHash, addLotHash, linkCustomerToLotHash, createErc20Hash]);

    // triger add customer tx
    const addCustomerHandler = async (
        firstName: string,
        lastName: string,
        customerAddress: string,
    ) => {
        setTxBeingHandled(TRANSACTIONS.addCustomer);
        setCurrentHash(null);
        setIsLoading(true);
        await addCustomerWrite(
            firstName,
            lastName,
            customerAddress,
            connectedAccount,
            globalCtx.deployedManagerAddress
        );
    };

    // triger add lot tx
    const addLotHandler = async (officialCode: string, shares: number) => {
        setTxBeingHandled(TRANSACTIONS.addLot);
        setCurrentHash(null);
        setIsLoading(true);
        await addLotWrite(officialCode, shares, connectedAccount, globalCtx.deployedManagerAddress);
    };

    // triger link customer to lot tx
    const linkCustomerToLotHandler = async (
        customerAddress: string,
        lotId: number,
    ) => {
        setTxBeingHandled(TRANSACTIONS.linkCustomerToLot);
        setCurrentHash(null);
        setIsLoading(true);
        await linkCustomerToLotWrite(customerAddress, lotId, connectedAccount, globalCtx.deployedManagerAddress);
        setLotIdBeingLinked(null);
    };

    // triger link customer to lot tx
    const createERC20Handler = async () => {
        setTxBeingHandled(TRANSACTIONS.createERC20);
        setCurrentHash(null);
        setIsLoading(true);
        await createERC20Write(connectedAccount, globalCtx.deployedManagerAddress);
    };

    //  set an id of lot to be linked to customer
    const openLinkLotModal = (lotId: number) => {
        setLotIdBeingLinked(lotId);
    };

    // Authorize page display
    if (!isConnected) {
        return <h1>Please connect your wallet first</h1>;
    }

    if (globalCtx.role !== OWNER_ROLE && globalCtx.role !== CUSTOMER_ROLE) {
        return <h1>Unauthorized</h1>;
    }

    const totalLotsShares = lots.reduce(
        (accumulator, currentValue) => accumulator + currentValue.shares,
        0,
    );

    // ERC20 Creation button
    let showCreateERC20Btn = false;
    if (!globalCtx.erc20Address && totalLotsShares === MAX_SHARES_LIMIT) {
        if (lots.length > 0) {
            let lotsCompleted = true;
            lots.forEach((l) => {
                if (l.hasOwnProperty("customer") === false) {
                    lotsCompleted = false;
                }
            });
            if (lotsCompleted) {
                showCreateERC20Btn = true;
            }
        }
    }

    // Array of modals
    let modals = [];
    if (error) {
        modals.push(
            <Modal onClose={() => setError(null)}>
                <ErrorBlock title="OUPS" message={error} />
            </Modal>,
        );
    }
    if (modalInfoText) {
        modals.push(
            <Modal onClose={() => setModalInfoText(null)}>{modalInfoText}</Modal>,
        );
    }

    if (isLoading) {
        modals.push(
            <NonClosableModal>
                <>
                    <h2>Transaction being processed</h2>
                    <LoadingIndicator />
                    <p>Tx Hash: {currentHash}</p>
                </>
            </NonClosableModal>,
        );
    }

    if (lotIdBeingLinked) {
        modals.push(
            <Modal onClose={() => setLotIdBeingLinked(null)}>
                <LinkCustomerToLotInput
                    onCreateLink={linkCustomerToLotHandler}
                    freeCustomers={customers.filter(
                        (c) => c.hasOwnProperty("lotId") === false,
                    )}
                    lot={lots.find((l) => l.id === lotIdBeingLinked)}
                />
            </Modal>,
        );
    }

    if (openCreateErc20Modal) {
        modals.push(
            <Modal onClose={() => setOpenCreateErc20Modal(false)}>
                <div>Créer un ERC unique.</div>
                <button className="nes-btn is-success" onClick={createERC20Handler}>
                    GO
                </button>
                <br></br>
            </Modal>,
        );
    }

    return (
        <>
            <h1>
                <i className="nes-icon coin is-large"></i>
                <u>Home</u>
            </h1>
            <p>Welcome, dear {globalCtx.role} !</p>
            {showCreateERC20Btn && (
                <button
                    className="nes-btn is-success"
                    onClick={() => setOpenCreateErc20Modal(true)}
                >
                    GO CREATE ERC20 !
                </button>
            )}
            {globalCtx.erc20Address && <p className="notification">ERC20 is Created ! Switch to ERC20 page !</p>}
            <CustomersList customers={customers} />
            <hr />
            {globalCtx.role === OWNER_ROLE && (
                <>
                    <AddCustomerInput onValidate={addCustomerHandler} /> <hr />
                </>
            )}
            <LotsList
                totalLotsShares={totalLotsShares}
                lots={lots}
                onLink={openLinkLotModal}
            />
            {globalCtx.role === OWNER_ROLE && (
                <>
                    <AddLotInput
                        onValidate={addLotHandler}
                        remainingSharesToGrant={MAX_SHARES_LIMIT - totalLotsShares}
                    />{" "}
                    <hr />
                </>
            )}
            {modals}
        </>
    );
}

export default Home;
