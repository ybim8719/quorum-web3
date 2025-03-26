import { Outlet, Link } from "react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
function Layout() {
  return (
    <div>
      <header>
        <ConnectButton />
        <nav>
          <ul>
            <Link to="/">HOME</Link>
            <Link to="/erc20">ERC20</Link>
            <Link to="/ballot">General Meeting</Link>;
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
