"use client";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "@/app/client";
import { useReadContract } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, PlayCircle, CreditCard, Search, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Balance from "./balance";
import AcceptHelp from "./acceptHelp";

// Define the type HelpRequest
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

// Connect to the contract
export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x1dB2fFf6589A2DDe1Fa0E4FcC1849BA98B48D01E",
});

export default function UnrequestedHelps() {
  const [selectedHelp, setSelectedHelp] = useState<HelpRequest | null>(null);
  const [showEarnOptions, setShowEarnOptions] = useState(false);

  const handleHelpClick = (help: HelpRequest) => {
    setSelectedHelp(selectedHelp?.id === help.id ? null : help);
  };

  const { data } = useReadContract({
    contract,
    method:
      "function getUnacceptedHelpRequests() view returns ((uint256 id, string helpName, string description, uint256 amount, string category, address requestedBy, address acceptedBy, bool isAccepted, bool isCompleted, bool isConfirmed)[])",
    params: [],
  });

  const helpRequests = Array.isArray(data) ? data : helpRequestsSample;

  return (
    <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <User className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Welcome, User
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search helps..."
              className="bg-purple-900 bg-opacity-50 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 text-purple-400" />
          </div>
          <Link
            href="/requestHelp"
            className="bg-purple-900 hover:bg-purple-800 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Link>
          <Balance />
          <div className="relative">
            <Button
              onClick={() => setShowEarnOptions(!showEarnOptions)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-80 transition-opacity"
            >
              Earn Coins
            </Button>
            <AnimatePresence>
              {showEarnOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-lg shadow-lg overflow-hidden z-10"
                >
                  <Button
                    className="w-full text-left px-4 py-2 hover:bg-purple-700 transition-colors flex items-center"
                    onClick={() => console.log("Buy with fiat")}
                  >
                    <CreditCard className="mr-2" /> Buy with Fiat
                  </Button>
                  <Link
                    className="w-full text-left px-4 py-2 hover:bg-purple-700 transition-colors flex items-center"
                    onClick={() => console.log("View reels")}
                    href={"/viewreels"}
                  >
                    <PlayCircle className="mr-2" /> View Reels
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main>
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Help Requests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpRequests.map((help: HelpRequest) => (
            <motion.div key={help.id} layout>
              <Card
                className="bg-gradient-to-br from-purple-900 to-black border border-purple-500 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 relative"
                onClick={() => handleHelpClick(help)}
              >
                <div
                  className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded-full"
                  style={{
                    background: "linear-gradient(to right, #34d399, #10b981)",
                  }}
                >
                  {help.category}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-500">
                    {help.helpName}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-300">
                      Requested by:{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {help.requestedBy}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-gray-300">
                      Amount:{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {help.amount} Coins
                      </span>
                    </p>
                  </div>
                  <p className="text-gray-400">{help.description}</p>

                  {selectedHelp?.id === help.id && <AcceptHelp id={help.id} />}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
