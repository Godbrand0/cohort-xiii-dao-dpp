import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreateProposalModal } from "../CreateProposalModal";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import { Toaster } from "sonner";
import useCreateProposal from "../../hooks/useCreateProposal";


const AppLayout = ({ children, chairPersonAddress }) => {
    const { address } = useAccount();
    const { treasuryValue} = useCreateProposal();
    

    return (
        <div className="w-full h-full">
            <header className="h-20 bg-amber-100 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span>LoGo</span>
                     Treasury Balance: {Number(treasuryValue) / 1e18} ETH
                    <div className="flex gap-4 items-center">
                        <ConnectButton />
                        {address &&
                            chairPersonAddress &&
                            isAddressEqual(chairPersonAddress, address) && (
                                <CreateProposalModal />
                            )}
                    </div>
                </div>
            </header>
            <main className="min-h-[calc(100vh-10rem)] w-full">
                <div className="container mx-auto">{children}</div>
            </main>
            <footer className="h-20 bg-amber-100 p-4">
                <div className="container mx-auto">
                    &copy; cohort xiii {new Date().getFullYear()}
                </div>
            </footer>
            <Toaster />
        </div>
    );
};

export default AppLayout;
