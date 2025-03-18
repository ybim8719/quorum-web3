// import { publicClient } from "@/utils/client"
// import { parseAbiItem } from "viem"
// import { useState, useEffect } from "react"

// import { useAccount } from "wagmi"
// import JobDetails from "./JobDetails"
// // Define a type for the job structure
// type Job = {
//   id: number;
//   author: `0x${string}` | undefined;
//   description: string | undefined;
//   isTaken: boolean;
//   isFinished: boolean;
//   price: bigint;
// };

// const Jobs = () => {
//   const { address } = useAccount()
//   // Use the Job type with useState
//   const [events, setEvents] = useState<Job[]>([]);

//   const getEvents = async () => {
//     const getJobAddedLogs = publicClient.getLogs({
//       event: parseAbiItem('event jobAdded(address indexed author, string description, uint price, uint id, bool isFinished)'),
//       fromBlock: 0n,
//       toBlock: 1000n
//     });

//     const getJobTakenLogs = publicClient.getLogs({
//       event: parseAbiItem('event jobTaken(address indexed worker, uint id)'),
//       fromBlock: 0n,
//       toBlock: 1000n
//     });

//     const getJobIsFinishedAndPaidLogs = publicClient.getLogs({
//       event: parseAbiItem('event jobIsFinishedAndPaid(address indexed author, address indexed worker, uint id, uint pricePaid)'),
//       fromBlock: 0n,
//       toBlock: 1000n
//     });

//     const [jobAddedLogs, jobTakenLogs, jobIsFinishedAndPaidLogs] = await Promise.all([
//       getJobAddedLogs,
//       getJobTakenLogs,
//       getJobIsFinishedAndPaidLogs
//     ]);

//     console.log(jobAddedLogs, jobTakenLogs, jobIsFinishedAndPaidLogs)

//     /*
//       0:true
//       1:true
//       7:true
//     */
//     const jobTakenMap = jobTakenLogs.reduce<Record<number, boolean>>((map, jobTaken) => {
//       const id = jobTaken.args.id !== undefined ? parseInt(jobTaken.args.id.toString()) : -1;
//       if (id !== -1) {
//         map[id] = true;
//       }
//       return map;
//     }, {});

//     const jobFinishedMap = jobIsFinishedAndPaidLogs.reduce<Record<number, boolean>>((map, jobFinished) => {
//       const id = jobFinished.args.id !== undefined ? parseInt(jobFinished.args.id.toString()) : -1;
//       if (id !== -1) {
//         map[id] = true;
//       }
//       return map;
//     }, {});

//     const allTheJobs = jobAddedLogs.map((jobAdded) => {
//       const id = jobAdded.args.id !== undefined ? parseInt(jobAdded.args.id.toString()) : -1;
//       const price = jobAdded.args.price !== undefined ? jobAdded.args.price : BigInt(0);
//       return {
//         id: id,
//         author: jobAdded.args.author,
//         description: jobAdded.args.description,
//         isTaken: jobTakenMap[id] || false,
//         isFinished: jobFinishedMap[id] || false,
//         price: price
//       };
//     });

//     console.log(allTheJobs)

//     setEvents(allTheJobs);
//   };

//   useEffect(() => {
//     const getAllEvents = async() => {
//       if (address) {
//         await getEvents()
//       }
//     }
//     getAllEvents()
//   }, [address])

//   return (
//     <>
//       {events.map((event) => (
//         <JobDetails key={event.id} job={event} getEvents={getEvents} />
//       ))}
//     </>
//   )
// }

// export default Jobs
