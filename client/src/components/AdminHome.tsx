import AddCustomer from "./shared/Customers/AddCustomer";
import CustomersList from "./shared/Customers/CustomersList";

function AdminHome() {

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

    return (
        <>
            <h1>HOME ADMIN !</h1>
            <div>
                <div className="flex-wrapper">
                    <CustomersList />
                    <AddCustomer />
                </div>



            </div>
        </>
    );
}

export default AdminHome;