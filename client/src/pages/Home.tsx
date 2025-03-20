import { useContext } from "react";
import { UserContext } from "../context/userContext";
import Unauthorized from "../components/shared/Unauthorized";
import AdminHome from "../components/AdminHome";
import CustomerHome from "../components/CustomerHome";
import { CUSTOMER_ROLE, ADMIN_ROLE } from "../models/roles";

function Home() {
    const userCtx = useContext(UserContext);

    let pageContent = <Unauthorized />
    if (userCtx.role == ADMIN_ROLE) {
        pageContent = <AdminHome />
    } else if (userCtx.role == CUSTOMER_ROLE) {
        pageContent = <CustomerHome />
    }

    return (
        <>
            {pageContent}
        </>
    );
}

export default Home;