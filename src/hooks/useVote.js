// import { useWriteContract, useAccount } from "wagmi";
// import { toast } from "sonner";
// import { QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI } from "../config/ABI";

// const useVote = () => {
//   const { address, isConnected } = useAccount();
//   const { writeContractAsync, isPending } = useWriteContract();

//   const vote = async (proposalId) => {
//     if (!isConnected) {
//       toast.error("Wallet not connected", {
//         description: "Please connect your wallet to vote",
//       });
//       return { success: false };
//     }

//     try {
//       const txHash = await writeContractAsync({
//         address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT,
//         abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
//         functionName: "vote",
//         args: [BigInt(proposalId)], // Convert to BigInt for uint256
//       });

//       toast.success("Vote submitted successfully!", {
//         description: "Your vote has been recorded on the blockchain",
//       });

//       return { success: true, txHash };
//     } catch (error) {
//       console.error("Voting failed:", error);

//       let errorMessage = "Voting failed";
//       let errorDescription = "An unexpected error occurred";

//       //   if (error.message?.includes("Voting period ended")) {
//       //     errorMessage = "Voting period ended";
//       //     errorDescription = "The deadline for this proposal has passed";
//       //   } else if (error.message?.includes("Already voted")) {
//       //     errorMessage = "Already voted";
//       //     errorDescription = "You have already voted on this proposal";
//       //   } else if (error.message?.includes("No voting power")) {
//       //     errorMessage = "No voting power";
//       //     errorDescription = "You need governance tokens to vote";
//       //   } else if (error.message?.includes("rejected")) {
//       //     errorMessage = "Transaction rejected";
//       //     errorDescription = "You rejected the transaction";
//       //   }

//       toast.error(errorMessage, {
//         description: errorDescription,
//       });

//       return { success: false, error: errorMessage };
//     }
//   };

//   return {
//     vote,
//     isVoting: isPending,
//   };
// };

// export default useVote;
