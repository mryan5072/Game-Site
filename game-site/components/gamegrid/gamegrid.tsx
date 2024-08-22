// components/GameGrid.tsx

interface Game {
    title: string;
    image: string;
  }
  
  const games: Game[] = new Array(8).fill({
    title: 'Elden Ring',
    image: '/images/Elden_Ring_Box_art.jpg', // Replace with your actual image path
  });
  
  const GameGrid: React.FC = () => {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {games.map((game, index) => (
          <div key={index} className="text-center">
            <img
              src={game.image}
              alt={game.title}
              className="rounded-lg shadow-lg"
            />
            <p className="mt-2 text-white">{game.title}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default GameGrid;
  