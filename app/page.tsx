"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coins, Users, Globe } from "lucide-react";
import { client } from "./client";
import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";

const rainbowGradient =
  "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600";
const subtleNeonGlow = "shadow-[0_0_10px_rgba(255,0,255,0.3)]";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  const activeAccount = useActiveAccount();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-slate-300 overflow-hidden">
      <header className="p-6 flex justify-between items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full" />
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-80 transition-opacity duration-300">
          <ConnectButton client={client} />
        </div>

        {activeAccount && (
          <Button
            onClick={() => router.push("/dashboard")}
            className={`${rainbowGradient} text-white font-bold py-3 px-6 rounded-xl text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 ${subtleNeonGlow}`}
          >
            DashBoard
          </Button>
        )}
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.h1
          className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to HelpCoin
        </motion.h1>

        <motion.p
          className="text-2xl mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Where humanity meets economy
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <FeatureCard
            icon={<Coins className="w-12 h-12 mb-4" />}
            title="Earn Real Money"
          >
            Help others and be rewarded with HelpCoins
          </FeatureCard>
          <FeatureCard
            icon={<Users className="w-12 h-12 mb-4" />}
            title="Community Driven"
          >
            Join a network of helpers and those in need
          </FeatureCard>
          <FeatureCard
            icon={<Globe className="w-12 h-12 mb-4" />}
            title="Decentralized"
          >
            Powered by blockchain technology for transparency and security
          </FeatureCard>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-800"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-opacity-0">
              Get Started
            </span>
            <motion.div
              className="absolute inset-0 w-full h-full transition-all bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500"
              initial={false}
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            />
          </Button>
        </motion.div>
      </main>

      <footer className="text-center py-6">
        <p>&copy; 2024 HelpCoin. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="p-6 rounded-lg bg-gradient-to-br from-purple-900 to-black border border-purple-500"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon}
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        {title}
      </h2>
      <p>{children}</p>
    </motion.div>
  );
}
