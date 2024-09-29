"use client";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { client } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";
import toastr from "toastr"; // Import Toastr
import "toastr/build/toastr.min.css"; // Import Toastr CSS
import TransferCoins from "./TransferCoins";

type HelpRequest = {
  id: string;
  helpName: string;
  description: string;
  amount: string;
  category: string;
  requestedBy: string;
  acceptedBy: string;
  isAccepted: boolean;
  isCompleted: boolean;
  isConfirmed: boolean;
};

const helpRequestsSample: HelpRequest[] = [
  // Sample data here
];

export default function Sidebar() {
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0x1dB2fFf6589A2DDe1Fa0E4FcC1849BA98B48D01E",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls popup visibility

  const togglePopup = () => setIsOpen(!isOpen); // Toggles popup

  const account = useActiveAccount();

  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getPendingConfirmationHelps(address _user) view returns ((uint256 id, string helpName, string description, uint256 amount, string category, address requestedBy, address acceptedBy, bool isAccepted, bool isCompleted, bool isConfirmed)[])",
    params: [account?.address ? account.address : "not available"],
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = (id: string) => {
    const transaction = prepareContractCall({
      contract,
      method: "function confirmHelp(uint256 _id)",
      params: [BigInt(id)],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        toastr.success("Help confirmed");
        togglePopup(); // Opens popup after successful confirmation
      },
      onError: () => {
        toastr.error("Confirmation failed");
      },
    });
  };

  const UnconfirmedRequests = Array.isArray(data) ? data : helpRequestsSample;

  return (
    <>
      <motion.div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-black border-r border-purple-500 p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
      >
        <Button
          className="absolute -right-12 top-4 bg-purple-500 hover:bg-purple-600"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronRight />
        </Button>
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Unconfirmed Helps
        </h2>
        {UnconfirmedRequests.map((helper) => (
          <>
            <motion.div
              key={helper.id}
              className="flex justify-between items-center mb-4 p-2 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div>
                <span className="font-semibold">{helper.helpName}</span>
                <div className="text-xs text-yellow-400">★ {helper.rating}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-gradient-to-r from-green-500 to-blue-500 text-white border-none "
                onClick={() => onClick(helper.id)}
              >
                {isPending ? "Loading..." : "Confirm"}
              </Button>
            </motion.div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={togglePopup}
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    transition={{ type: "spring", damping: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-2xl max-w-md w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 shadow-lg"
                  >
                    <div className="relative bg-black p-8 rounded-xl">
                      <Button
                        onClick={togglePopup}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        variant="ghost"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                      <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        Popup Title
                      </h2>
                      <p className="text-gray-300 mb-6">
                        This is the content of your popup. You can add any
                        information or components here.
                        <TransferCoins
                          to={helper.acceptedBy}
                          amount={helper.amount}
                        />
                      </p>
                      <div className="flex justify-end">
                        <Button
                          onClick={togglePopup}
                          className="text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ))}
      </motion.div>
    </>
  );
}
