import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-8 text-center"
    >
      <h1 className="mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text font-frijole text-4xl font-bold text-transparent sm:text-5xl">
        SLIDING PUZZLE
      </h1>
    </motion.div>
  );
}
