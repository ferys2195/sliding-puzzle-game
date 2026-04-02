import { motion } from "framer-motion";
import { Award, Clock, Grid3x3, Move, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { formatTime } from "@/utils/formatTime";

type Props = {
  moveCount: number;
  elapsedTime: number;
  bestScore: { moves: number; time: number } | null;
  size: number;
  setSize: (size: number) => void;
  resetGame: () => void;
};
export default function Panel({
  moveCount,
  elapsedTime,
  bestScore,
  size,
  setSize,
  resetGame,
}: Props) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="mb-6 w-full rounded-2xl bg-white/10 p-4 shadow-2xl backdrop-blur-lg"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <Move className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5" />
          <span className="text-sm text-gray-300 sm:text-base">Step:</span>
          <span className="text-xl font-bold text-white sm:text-2xl">
            {moveCount}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <Clock className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
          <span className="text-sm text-gray-300 sm:text-base">Time:</span>
          <span className="font-mono text-xl font-bold text-white sm:text-2xl">
            {formatTime(elapsedTime)}
          </span>
        </div>
        {bestScore && (
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
              <span className="text-sm text-gray-300 sm:text-base">
                Best Score:
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-yellow-400 sm:text-base">
                {bestScore.moves} Step / {formatTime(bestScore.time)}
              </span>
            </div>
          </div>
        )}

        <div className="flex w-full items-center gap-3">
          <div className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
            <Grid3x3 className="h-4 w-4 text-purple-400" />
            <Select
              defaultValue={size.toString()}
              onValueChange={(value) => setSize(parseInt(value))}
            >
              <SelectTrigger className="w-full border-white/30 bg-transparent text-white hover:bg-white/10">
                <SelectValue placeholder="Size Tiles" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="border-white/20 bg-slate-800"
              >
                {[3, 4, 5, 6, 7, 8, 9].map((val) => (
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

          <Button onClick={resetGame} size={"icon-lg"} variant={"outline"}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
