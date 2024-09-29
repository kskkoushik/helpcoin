import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { Button } from "./ui/button";

interface TransferProps {
  to: string;
  amount: string;
}

const rainbowGradient =
  "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600";
const subtleNeonGlow = "shadow-[0_0_10px_rgba(255,0,255,0.3)]";

export default function TranferCoins({ to, amount }: TransferProps) {
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0x63b046166106A8130A85296daB6f55b84Cbb69a8",
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = (to: string, amount: string) => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function transferFrom(address from, address to, uint256 amount) returns (bool)",
      params: [
        "0x7027109f5bB4847B4Cb1caFDe993429a841A78AD",
        to,
        BigInt(amount),
      ],
    });
    sendTransaction(transaction);
  };

  return (
    <Button
      onClick={() => onClick(to, amount)}
      className={`${rainbowGradient} text-white font-bold py-3 px-6 rounded-xl text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 ${subtleNeonGlow}`}
    >
      Confirm payment
    </Button>
  );
}
