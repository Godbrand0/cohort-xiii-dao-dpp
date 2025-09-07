import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "../../lib/utils";
import { formatEther } from "viem";

const ProposalCard = ({
    id,
    description,
    recipient,
    amount,
    voteCount,
    deadline,
    executed,
    isVoted,
    handleVote,
}) => {
    
    // Format deadline
    const formatDeadline = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    // Check if deadline has passed
    const isDeadlinePassed = () => {
        if (!deadline) return false;
        return Date.now() > Number(deadline) * 1000;
    };

    // Format amount (assuming it's in wei)
    const formatAmount = (amount) => {
        if (!amount) return "0 ETH";
        try {
            return `${formatEther(amount)} ETH`;
        } catch {
            return `${amount} wei`;
        }
    };

    const deadlinePassed = isDeadlinePassed();
    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Proposal #{id}</span>
                    <span>Vote Count: {voteCount}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <span>Recipient:</span>
                    <span>{shortenAddress(recipient, 4)}</span>
                </div>
                <div>
                    <span>Amount:</span>
                    <span>{formatAmount(amount)}</span>
                </div>
                <div>
                    <span>Deadline:</span>
                    <span className={`text-sm ${deadlinePassed ? 'text-red-600' : ''}`}>{formatDeadline(deadline)}</span>
                </div>
                <div>
                    <span>Executed:</span>
                    <span>{executed}</span>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    onClick={handleVote}
                    disabled={isVoted}
                    type="submit"
                    className="w-full"
                >
                    Vote
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProposalCard;
