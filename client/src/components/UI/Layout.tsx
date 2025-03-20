import { Outlet } from 'react-router';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Layout() {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><ConnectButton /></li>
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