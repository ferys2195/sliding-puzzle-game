"use client";

import { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import { generateSolvablePuzzle, moveTile } from "../lib/puzzle";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RefreshCcw, Trophy, Clock, Move, Grid3x3, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

function isSolved(tiles: (number | null)[]): boolean {
  const last = tiles.length - 1;
  for (let i = 0; i < last; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[last] === null;
}

export default function PuzzleGame() {
  const [size, setSize] = useState(3);
  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [bestScore, setBestScore] = useState<{
    moves: number;
    time: number;
  } | null>(null);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`bestScore_${size}`);
    if (saved) {
      setBestScore(JSON.parse(saved));
    }
  }, [size]);

  const resetGame = useCallback(() => {
    setTiles(generateSolvablePuzzle(size));
    setMoveCount(0);
    setElapsedTime(0);
    setStartTime(null);
    setShowWinModal(false);
    setIsGameWon(false);
  }, [size]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime && !isGameWon) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, isGameWon]);

  const fireConfetti = () => {
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { y: 0.6 },
      colors: [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ],
    });
  };

  const handleTileClick = (index: number) => {
    const newTiles = moveTile(tiles, index, size);
    if (newTiles) {
      setTiles(newTiles);
      if (moveCount === 0) {
        setStartTime(Date.now());
      }
      const newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);

      if (isSolved(newTiles)) {
        setIsGameWon(true);
        setShowWinModal(true);
        fireConfetti();

        // Update best score
        const currentScore = { moves: newMoveCount, time: elapsedTime + 1 };
        if (
          !bestScore ||
          newMoveCount < bestScore.moves ||
          (newMoveCount === bestScore.moves && elapsedTime + 1 < bestScore.time)
        ) {
          setBestScore(currentScore);
          localStorage.setItem(
            `bestScore_${size}`,
            JSON.stringify(currentScore),
          );
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
            SLIDING PUZZLE
          </h1>
          <p className="text-sm text-gray-300 sm:text-base">
            Susun angka dari 1 hingga {size * size - 1}
          </p>
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 sm:gap-6">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <Move className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5" />
                <span className="text-sm text-gray-300 sm:text-base">
                  Langkah:
                </span>
                <span className="text-xl font-bold text-white sm:text-2xl">
                  {moveCount}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <Clock className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
                <span className="text-sm text-gray-300 sm:text-base">
                  Waktu:
                </span>
                <span className="font-mono text-xl font-bold text-white sm:text-2xl">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              {bestScore && (
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <Award className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
                  <span className="text-sm text-gray-300 sm:text-base">
                    Terbaik:
                  </span>
                  <span className="text-sm font-bold text-yellow-400 sm:text-base">
                    {bestScore.moves} langkah / {formatTime(bestScore.time)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
                <Grid3x3 className="h-4 w-4 text-purple-400" />
                <Select
                  defaultValue={size.toString()}
                  onValueChange={(value) => setSize(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px] border-white/30 bg-transparent text-white hover:bg-white/10">
                    <SelectValue placeholder="Ukuran" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="border-white/20 bg-slate-800"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                      <SelectItem
                        key={val}
                        value={val.toString()}
                        className="text-white hover:bg-purple-600"
                      >
                        {val}x{val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={resetGame}
                size={"icon"}
                variant={"default"}
                className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="aspect-square w-full sm:w-[500px] xl:w-[600px]">
              <Board tiles={tiles} onTileClick={handleTileClick} size={size} />
            </div>
          </div>
        </motion.div>

        {/* Victory Modal */}
        <AnimatePresence>
          {showWinModal && (
            <Dialog open={showWinModal} onOpenChange={setShowWinModal}>
              <DialogContent className="border-none bg-gradient-to-br from-green-500 to-emerald-600 text-center [&>button.absolute]:text-white [&>button.absolute]:hover:bg-white/20">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <DialogHeader>
                    <div className="mb-4 flex justify-center">
                      <Trophy className="h-16 w-16 text-yellow-300" />
                    </div>
                    <DialogTitle className="mb-2 text-3xl font-bold text-white">
                      🎉 Selamat! Kamu Menang! 🎉
                    </DialogTitle>
                    <DialogDescription className="text-lg text-white/90">
                      Puzzle berhasil diselesaikan!
                    </DialogDescription>
                  </DialogHeader>

                  <div className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-white/20 p-4">
                    <div className="text-center">
                      <Move className="mx-auto mb-2 h-6 w-6 text-white" />
                      <div className="text-sm text-white/80">Total Langkah</div>
                      <div className="text-2xl font-bold text-white">
                        {moveCount}
                      </div>
                    </div>
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 h-6 w-6 text-white" />
                      <div className="text-sm text-white/80">Waktu</div>
                      <div className="font-mono text-2xl font-bold text-white">
                        {formatTime(elapsedTime)}
                      </div>
                    </div>
                  </div>

                  {bestScore &&
                    bestScore.moves === moveCount &&
                    bestScore.time === elapsedTime && (
                      <p className="mb-4 font-semibold text-yellow-300">
                        🏆 Rekor Terbaru! 🏆
                      </p>
                    )}

                  <DialogFooter className="mt-4">
                    <Button
                      onClick={() => {
                        resetGame();
                        setShowWinModal(false);
                      }}
                      className="rounded-lg bg-white px-6 py-3 font-semibold text-green-600 shadow-lg hover:bg-gray-100"
                    >
                      Main Lagi
                    </Button>
                  </DialogFooter>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-xs text-gray-400 sm:text-sm"
        >
          <p>
            Klik pada ubin yang berdekatan dengan ruang kosong untuk
            memindahkannya
          </p>
          <p className="mt-1">Copyright © 2025 by Fery Irawan</p>
        </motion.div>
      </div>
    </div>
  );
}
