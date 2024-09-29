import { client } from "@/app/client";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { Button } from "./ui/button";
import toastr from "toastr"; // Import Toastr
import "toastr/build/toastr.min.css";

interface AcceptHelpProps {
  id: string;
}

export default function AcceptHelp({ id }: AcceptHelpProps) {
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0x1dB2fFf6589A2DDe1Fa0E4FcC1849BA98B48D01E",
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function acceptHelpRequest(uint256 _id)",
      params: [BigInt(id)],
    });
    sendTransaction(transaction);
    toastr.success("Help Accepted");
  };

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-80 transition-opacity mt-4"
    >
      Accept Request
    </Button>
  );
}
