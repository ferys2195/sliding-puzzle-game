import { AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { motion } from "framer-motion";
import { Clock, Move, Trophy } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import { Button } from "./ui/button";

type Props = {
  showWinModal: boolean;
  setShowWinModal: (show: boolean) => void;
  moveCount: number;
  elapsedTime: number;
  bestScore: { moves: number; time: number } | null;
  resetGame: () => void;
};
export default function VictoryModal({
  showWinModal,
  setShowWinModal,
  moveCount,
  elapsedTime,
  bestScore,
  resetGame,
}: Props) {
  return (
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
                  🎉 Congratulation! You Won! 🎉
                </DialogTitle>
                <DialogDescription className="text-lg text-white/90">
                  Puzzle successfully completed!
                </DialogDescription>
              </DialogHeader>

              <div className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-white/20 p-4">
                <div className="text-center">
                  <Move className="mx-auto mb-2 h-6 w-6 text-white" />
                  <div className="text-sm text-white/80">Total Steps</div>
                  <div className="text-2xl font-bold text-white">
                    {moveCount}
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="mx-auto mb-2 h-6 w-6 text-white" />
                  <div className="text-sm text-white/80">Time</div>
                  <div className="font-mono text-2xl font-bold text-white">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              </div>

              {bestScore &&
                bestScore.moves === moveCount &&
                bestScore.time === elapsedTime && (
                  <p className="mb-4 font-semibold text-yellow-300">
                    🏆 New Record! 🏆
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
                  Play Again
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
