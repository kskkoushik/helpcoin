// src/client.ts
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: "8a9b691a26c85aa5d97aa33d2f2251bd",
});

export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x1dB2fFf6589A2DDe1Fa0E4FcC1849BA98B48D01E",
});
