"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

// Sample video links (replace with your actual video links)
const videoLinks = [
  "https://youtube.com/shorts/L0G140qhs4Q?si=7QyUy5QVYDVUPMGp",
  "https://youtube.com/shorts/0jVSFZ_nwDQ?si=6YdHSaymn608kZ7P",
  "https://youtube.com/shorts/OSh4zNanAnE?si=d_5__yWxOlcYYPcI",
  "https://youtube.com/shorts/1ZJ7PGWZWi8?si=BJoCu2JGGLpoRrrR",
  "https://youtube.com/shorts/VsHggHmEBC8?si=4JdUz_KSydjrCM0H",
];

export default function VideoReels() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [showEarnings, setShowEarnings] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setWatchTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleProgress = (state: { played: number }) => {
    if (state.played === 1) {
      handleNextVideo();
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoLinks.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videoLinks.length) % videoLinks.length
    );
  };

  const calculateEarnings = () => {
    // Example calculation: $0.01 per second watched
    return (watchTime * 0.01).toFixed(2);
  };

  return (
    <div className="h-screen bg-black text-slate-300 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        className="w-full h-full max-w-md relative overflow-hidden rounded-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 rounded-2xl">
          <div className="absolute inset-0 bg-black rounded-2xl overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              url={videoLinks[currentVideoIndex]}
              width="100%"
              height="100%"
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onProgress={handleProgress}
              onEnded={handleNextVideo}
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
        </div>

        <motion.div
          className="absolute bottom-4 left-4 right-4 flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handlePrevVideo}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={handleNextVideo}
            className="bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-2 hover:opacity-80 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setShowEarnings(!showEarnings)}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-80 transition-opacity"
        >
          See Your Earnings
        </Button>
      </motion.div>

      <AnimatePresence>
        {showEarnings && (
          <motion.div
            className="mt-4 p-4 bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-semibold mb-2">Your Earnings</p>
            <div className="flex items-center justify-center">
              <DollarSign className="w-6 h-6 mr-2 text-green-400" />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                HC{calculateEarnings()}
              </span>
            </div>
            <p className="mt-2 text-sm">
              Total watch time: {watchTime} seconds
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
