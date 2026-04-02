import Footer from "../components/Footer";
import Puzzle from "../components/Puzzle";
import { motion } from "framer-motion";

export default function IndexPage() {
  return (
    <div className="flex size-full h-screen max-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3">
      <header className="p-3">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text font-frijole text-4xl font-bold text-transparent sm:text-5xl">
            SLIDING PUZZLE
          </h1>
        </motion.div>
      </header>
      <div className="container mx-auto max-w-7xl flex-1">
        <Puzzle />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
