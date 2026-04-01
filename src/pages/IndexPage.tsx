import Footer from "../components/Footer";
import Puzzle from "../components/Puzzle";

export default function IndexPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden p-3">
      <header className="p-3">
        <div className="text-center">
          <h1 className="mb-1 font-frijole text-2xl font-bold">
            Sliding Puzzle Game
          </h1>
        </div>
      </header>
      <div className="container mx-auto flex-1">
        <Puzzle />
      </div>
      <footer className="container mx-auto">
        <Footer />
      </footer>
    </div>
  );
}
