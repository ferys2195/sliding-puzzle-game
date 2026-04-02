"use client";

import Tile from "./Tile";

export default function Board({
  tiles,
  onTileClick,
  size,
}: {
  tiles: (number | null)[];
  onTileClick: (index: number) => void;
  size: number;
}) {
  return (
    <div
      className="grid h-full w-full gap-1 rounded-2xl bg-white/10 p-4 shadow backdrop-blur-lg"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          value={tile}
          size={size}
          onClick={() => onTileClick(index)}
          isEmpty={tile === null}
        />
      ))}
    </div>
  );
}
