import Header from "@/components/Header";
import Footer from "../components/Footer";
import Puzzle from "../components/Puzzle";

export default function IndexPage() {
  return (
    <div className="flex size-full h-screen max-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3">
      <header className="p-3">
        <Header />
      </header>
      <main className="container mx-auto max-w-7xl flex-1">
        <Puzzle />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
