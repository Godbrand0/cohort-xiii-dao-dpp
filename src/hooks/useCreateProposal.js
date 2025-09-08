import React, { useCallback } from "react";
import useChairPerson from "./useChairPerson";
import { toast } from "sonner";
import { isAddressEqual } from "viem";
import {
  useAccount,
  useWalletClient,
  useWriteContract,
  useBalance,
} from "wagmi";
import { QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI } from "../config/ABI";

const useCreateProposal = () => {
  const { address } = useAccount();
  const chairPerson = useChairPerson();
  const walletClient = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const tressuryBalance = useBalance({
    address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT,
    watch: true,
  });

  const treasuryValue =
    tressuryBalance && tressuryBalance.data
      ? tressuryBalance.data.value
      : undefined;

  const createProposal = useCallback(
    async (description, recipient, amountInwei, durationInSeconds) => {
      if (!address || !walletClient) {
        toast.error("Not connected", {
          description: "Kindly connect your address",
        });
        return;
      }
      if (chairPerson && !isAddressEqual(address, chairPerson)) {
        toast.error("Unauthorized", {
          description: "This action is only available to the chairperson",
        });
        return;
      }
      if (treasuryValue < BigInt(amountInwei)) {
        toast.error("insufficient funds", {
          description: " there is not enough balance in the account",
        });
        return;
      }

      const txHash = await writeContractAsync({
        address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT,
        abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
        functionName: "createProposal",
        args: [description, recipient, amountInwei, durationInSeconds],
      });

      console.log("txHash: ", txHash);

      const txReceipt = await walletClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (txReceipt.status === "success") {
        toast.success("Create proposal succeussfull", {
          description: "You have successfully created a proposal",
        });
      }
    },
    [address, chairPerson, walletClient, writeContractAsync, treasuryValue]
  );
  return { createProposal, treasuryValue };
};

export default useCreateProposal;
