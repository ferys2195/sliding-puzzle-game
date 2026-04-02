"use client";

import { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import { generateSolvablePuzzle, moveTile } from "../lib/puzzle";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Panel from "./Panel";
import VictoryModal from "./VictoryModal";

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

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text font-frijole text-4xl font-bold text-transparent sm:text-5xl">
          SLIDING PUZZLE
        </h1>
      </motion.div>

      {/* Stats Panel */}
      <Panel
        moveCount={moveCount}
        elapsedTime={elapsedTime}
        bestScore={bestScore}
        size={size}
        setSize={setSize}
        resetGame={resetGame}
      />
      {/* Game Board */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mx-auto aspect-square w-full touch-none overflow-hidden rounded-2xl bg-white/10 p-4 shadow backdrop-blur-lg sm:w-1/3 xl:w-2/5">
          <Board tiles={tiles} onTileClick={handleTileClick} size={size} />
        </div>
      </motion.div>

      {/* Victory Modal */}
      <VictoryModal
        showWinModal={showWinModal}
        setShowWinModal={setShowWinModal}
        moveCount={moveCount}
        elapsedTime={elapsedTime}
        bestScore={bestScore}
        resetGame={resetGame}
      />
    </div>
  );
}
