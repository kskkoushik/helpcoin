import { defineChain } from "thirdweb/chains";
import { client } from "@/app/client";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { useEffect, useState } from "react";

import React from "react";

const Balance = () => {
  const account = useActiveAccount();

  const chain = defineChain(11155111);
  const { data, isLoading } = useWalletBalance({
    chain,
    address: account?.address,
    client,
    tokenAddress: "0x63b046166106A8130A85296daB6f55b84Cbb69a8",
  });

  const [bal, setBal] = useState("balance");

  useEffect(() => {
    if (data) {
      setBal(data.displayValue);
    }
  }, [data]);

  return (
    <div className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
      {isLoading ? "Loading..." : `${bal} HelpCoins`}
    </div>
  );
};

export default Balance;
