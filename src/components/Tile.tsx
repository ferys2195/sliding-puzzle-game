"use client";

import { cn } from "../lib/utils";

const getFontSize = (size: number) => {
  if (size <= 3) return "text-5xl";
  if (size <= 4) return "text-4xl";
  if (size <= 5) return "text-3xl";
  if (size <= 7) return "text-2xl";
  return "text-lg";
};

export default function Tile({
  value,
  onClick,
  isEmpty,
  size,
}: {
  value: number | null;
  onClick: () => void;
  isEmpty: boolean;
  size: number;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-gray-400 bg-gray-200 font-knewave transition-all duration-200 ease-in-out select-none",
        isEmpty && "cursor-default bg-transparent",
      )}
    >
      <span className={`font-bold ${getFontSize(size)}`}>{value}</span>
    </div>
  );
}
