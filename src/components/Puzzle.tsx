"use client";

import { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import { generateSolvablePuzzle, moveTile } from "../lib/puzzle";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import confetti from "canvas-confetti"; // 🚀 import confetti

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
        fireConfetti(); // 🎉 Tambahkan efek confetti saat menang
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
    <div className="flex max-w-screen flex-col items-center justify-center space-y-4 p-4">
      <div className="text-sm text-gray-700">
        Langkah: {moveCount} | Waktu: {formatTime(elapsedTime)}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="size">Pilih ukuran papan:</Label>
        <Select
          defaultValue={size.toString()}
          onValueChange={(value) => setSize(parseInt(value))}
        >
          <SelectTrigger className="w-[120px] bg-white text-black">
            <SelectValue placeholder="Ukuran" />
          </SelectTrigger>
          <SelectContent position="popper">
            {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <SelectItem key={val} value={val.toString()}>
                {val}x{val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={resetGame}
          size={"icon"}
          variant={"default"}
          className="hover:cursor-pointer"
        >
          <RefreshCcw />
        </Button>
      </div>

      <div className="aspect-square w-full sm:w-1/3 xl:w-2/5">
        <Board tiles={tiles} onTileClick={handleTileClick} size={size} />
      </div>

      <Dialog open={showWinModal}>
        <DialogContent className="text-center [&>button.absolute]:hidden">
          <DialogHeader>
            <DialogTitle>🎉 Selamat, Kamu Menang!</DialogTitle>
            <DialogDescription>
              Puzzle diselesaikan dengan <strong>{moveCount}</strong> langkah
              dalam waktu <strong>{formatTime(elapsedTime)}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                resetGame();
              }}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
