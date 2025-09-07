import { useEffect, useState } from "react";
import { useBlockNumber, usePublicClient } from "wagmi";
import { QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI } from "../config/ABI";
import { parseAbiItem } from "viem";

const useProposals = () => {
  const [proposals, setProposals] = useState([]);
  const publicClient = usePublicClient();
  const block = useBlockNumber();

  useEffect(() => {
    if (!publicClient || !block.data) return;

    let unwatch;

    const fetchPastProposals = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT,
          event: parseAbiItem(
            "event ProposalCreated(uint256 indexed proposalId, string description, address recipient, uint256 amount, uint256 deadline)"
          ),
          fromBlock: block.data - 50000n, // ideally from deployment block
          toBlock: "latest",
        });

        const parsed = logs.map((log) => ({ 
          id: Number(log.args.proposalId), // Added id prop
          proposalId: log.args.proposalId.toString(),
          description: log.args.description,
          recipient: log.args.recipient,
          amount: log.args.amount.toString(),
          deadline: log.args.deadline.toString(),
          voteCount: 0, // Added voteCount prop (default to 0)
          executed: false, // Added executed prop (default to false)
          isVoted: false, // Added isVoted prop (default to false)
        }));

        const unique = [
          ...new Map(parsed.map((p) => [p.proposalId, p])).values(),
        ].sort((a, b) => Number(b.proposalId) - Number(a.proposalId));

        setProposals(unique);

        // ✅ Setup watcher after initial load
        unwatch = publicClient.watchEvent({
          address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT,
          event: parseAbiItem(
            "event ProposalCreated(uint256 indexed proposalId, string description, address recipient, uint256 amount, uint256 deadline)"
          ),
          onLogs: (newLogs) => {
            setProposals((prev) => {
              const updates = newLogs.map((log) => ({
                id: Number(log.args.proposalId), // Added id prop
                proposalId: log.args.proposalId.toString(),
                description: log.args.description,
                recipient: log.args.recipient,
                amount: log.args.amount.toString(),
                deadline: log.args.deadline.toString(),
                voteCount: 0, // Added voteCount prop (default to 0)
                executed: false, // Added executed prop (default to false)
                isVoted: false, // Added isVoted prop (default to false)
              }));

              const merged = [...prev, ...updates];
              const unique = [
                ...new Map(merged.map((p) => [p.proposalId, p])).values(),
              ];

              return unique.sort(
                (a, b) => Number(b.proposalId) - Number(a.proposalId)
              );
            });
          },
          onError: (err) => console.error("watchEvent error:", err),
        });
      } catch (error) {
        console.error("Error loading past proposals:", error);
      }
    };

    fetchPastProposals();

    // ✅ cleanup watcher
    return () => {
      if (unwatch) unwatch();
    };
  }, [publicClient, block.data]);
  console.log();

  return proposals;
};

export default useProposals;
