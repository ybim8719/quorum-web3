// import './App.css'
// import { useState, useEffect, useContext } from "react";
// import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Compiled from "../constants/VotingOptiAbi.json";
// import { ANVIL_VOTINGOPTI_ADRESS } from "../constants/deployed";
// import { UserContext } from './context/userContext';
// import { useQueries } from "./hooks/useWalletQueries";
// import { abi } from '../constants/abi';
// // import { parseAbiItem } from "viem";
// // import { publicClient } from "../utils/client";

// const Example = () => {
//     const { address } = useAccount();
//     const globalCtx = useContext(UserContext);
//     const [status, setStatus] = useState<string>("");
//     const [voters, setVoters] = useState<string[]>([]);

//     const [enteredVoter, setEnteredVoter] = useState<string>("");

//     const { usefetchedCurrentStatus, usefetchedVoters } = useQueries();
//     const { data: fetchedStatusData, error: fetchedStatusError, isPending: fetchStatusIsPending, refetch: refetchCurrentStatus } = usefetchedCurrentStatus;
//     const { data: fetchedVotersData, error: fetchVotersError, isPending: fetchVotersIsPending, refetch: refetchVoters } = usefetchedVoters;

//     const { data: hash, error: writeError, isPending: writeIsPending, writeContract } = useWriteContract();
//     const { isLoading: txIsConfirming, isSuccess: txIsSuccess, error: txError } = useWaitForTransactionReceipt({ hash });

//     const addVoterHandler = (e: React.MouseEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         writeContract({
//             address: ANVIL_VOTINGOPTI_ADRESS,
//             abi: Compiled.abi,
//             functionName: 'registerVoter',
//             args: [enteredVoter]
//         })
//         setEnteredVoter("");
//     };

//     useEffect(() => {
//         console.log(fetchedStatusData, "useeffecrt");
//         console.log(typeof fetchedStatusData, "type");
//         if (fetchedStatusData !== undefined && fetchedStatusData !== null) {
//             console.log(typeof fetchedStatusData, "went");
//             setStatus(fetchedStatusData.toString());
//         }
//     }, [fetchedStatusData]);

//     const testFetch = async () => {
//         await refetchCurrentStatus();
//         await refetchVoters();
//         // await getEvents();
//     }

//     if (txError || writeError) {
//         console.log(txError);
//         console.log(writeError);
//     }

//     console.log(fetchStatusIsPending, "fetchStatusIsPending");

//     return (
//         <div>
//             <div>
//                 <ConnectButton />
//             </div>
//             <button onClick={testFetch}> fetch all</button>
//             <h2 >STATUS</h2>
//             <div>
//                 {fetchStatusIsPending ? <div>Chargement...</div> : <p>Status: <span>{status}</span></p>}
//             </div>
//             <h2 >VOTERS</h2>
//             <div>
//                 {fetchVotersIsPending ? <div>Chargement...</div> : <p>Voters: <span>{voters.length}</span></p>}
//             </div>

//             <h2 >ADD VOTER</h2>
//             <div>
//                 {hash && <p>Transaction Hash: {hash}</p>}
//                 {txIsConfirming &&
//                     <p>
//                         Waiting for confirmation...
//                     </p>
//                 }
//                 {txIsSuccess &&
//                     <p>
//                         Transaction confirmed.
//                     </p>
//                 }
//             </div >

//             <form onSubmit={addVoterHandler}>
//                 <label htmlFor="inline_field">
//                     Add your future voters:
//                     <input
//                         value={enteredVoter}
//                         onChange={(e) => setEnteredVoter(e.target.value)}
//                         type="text"
//                         id=""
//                         className=""
//                         placeholder="Type voter address..."
//                     />
//                 </label>
//                 <input type="submit" value="Send Tx" />
//             </form>
//         </div >
//     )
// }

// export default Example
