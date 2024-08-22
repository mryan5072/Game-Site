// pages/index.tsx
import Navbar from '../components/navbar/navbar';
import SearchBar from '../components/searchbar/searchbar';
import GameGrid from '../components/gamegrid/gamegrid';

const Home: React.FC = () => {
  return (
    <div className="bg-[rgb(25,25,25)] text-black min-h-screen"> {/* Main body color */}
      <div className="bg-[rgb(25,25,25)]"> {/* Section color under navbar */}
        <SearchBar />
      </div>
      <GameGrid />
    </div>
  );
};

export default Home;
