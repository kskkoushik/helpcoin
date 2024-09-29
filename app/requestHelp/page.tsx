"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, DollarSign, Send, CheckCircle } from "lucide-react";
import {
  useActiveAccount,
  useWalletBalance,
  useSendTransaction,
} from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { client, contract } from "../client";
import { prepareContractCall, getContract } from "thirdweb";

const rainbowBorder = "border-4 border-transparent bg-clip-padding p-[2px]";
const rainbowGradient =
  "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600";
const subtleNeonGlow = "shadow-[0_0_10px_rgba(255,0,255,0.3)]";

const categories = [
  "Technology",
  "Education",
  "Home & Garden",
  "Language",
  "Health",
  "Finance",
  "Other",
];

export default function RequestHelp() {
  const [userName, setUserName] = useState<string | undefined>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [helpname, setHelpname] = useState<string>("");
  const account = useActiveAccount();
  const chain = defineChain(11155111);
  const router = useRouter();

  useEffect(() => {
    if (account?.address) {
      setUserName(account.address);
    }
  }, [account]);

  const { data } = useWalletBalance({
    chain,
    address: account?.address,
    client,
    tokenAddress: "0x63b046166106A8130A85296daB6f55b84Cbb69a8",
  });

  const [balance, setBalance] = useState(data?.displayValue);
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: sendTransaction } = useSendTransaction();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHelpname(e.target.value);
  };

  const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare contract call
      const transaction = prepareContractCall({
        contract, // Replace with your contract instance
        method:
          "function createHelpRequest(string _helpName, string _description, uint256 _amount, string _category)",
        params: [helpname, description, BigInt(amount), category],
      });

      // Send transaction
      sendTransaction(transaction);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating help request:", error);
    }

    const cointrans = () => {
      const contract = getContract({
        client,
        chain: defineChain(11155111),
        address: "0x63b046166106A8130A85296daB6f55b84Cbb69a8",
      });

      const transaction = prepareContractCall({
        contract,
        method: "function transfer(address to, uint256 amount) returns (bool)",
        params: ["0x7027109f5bB4847B4Cb1caFDe993429a841A78AD", BigInt(amount)],
      });
      sendTransaction(transaction);
      setBalance(data?.displayValue);
    };

    cointrans();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3b0764,_#1e1b4b,_#000000)] animate-pulse"></div>
      </div>

      <header className="flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center space-x-4">
          <User className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {userName}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            {balance} HC
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto relative z-10">
        <motion.h1
          className={`text-5xl font-bold mb-8 text-center text-transparent bg-clip-text ${rainbowGradient}`}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Request Help
        </motion.h1>

        <div
          className={`${rainbowBorder} ${rainbowGradient} rounded-2xl ${subtleNeonGlow}`}
        >
          <Card className="p-8 bg-black rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="helpName"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Help Name
                </label>
                <Input
                  id="helpName"
                  name="helpName"
                  value={helpname}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border-gray-700 text-white rounded-xl"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleDescChange}
                  className="w-full bg-gray-900 border-gray-700 text-white rounded-xl"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Amount (HelpCoins)
                </label>
                <Input
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-gray-900 border-gray-700 text-white rounded-xl"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Category
                </label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white rounded-xl">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className={`w-full ${rainbowGradient} text-white font-bold py-4 px-6 rounded-xl text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 ${subtleNeonGlow} flex items-center justify-center`}
              >
                Submit Request <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-green-700 text-white rounded-xl shadow-xl z-40"
          >
            <CheckCircle className="w-6 h-6 inline-block mr-2" />
            Help request created successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
