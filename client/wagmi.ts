import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, anvil } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia, anvil],
});
