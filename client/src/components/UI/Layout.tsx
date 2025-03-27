import { Outlet, Link } from "react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
function Layout() {
  return (
    <div>
      <header>
        <ConnectButton />
        <nav>
          <ul>
            <Link className="navItem" to="/">HOME</Link>
            <Link className="navItem" to="/erc20">ERC20</Link>
            <Link className="navItem" to="/ballot">General Meeting</Link>;
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
