import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface Game {
  id: number;
  name: string;
  cover?: { image_id: string };
}

interface GameGridProps {
  games: Game[];
}

const GameCards: React.FC<GameGridProps> = ({ games }) => {
  return (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
    <div className="grid-container">
      {games.length === 0 ? (
        <Typography>No games found</Typography>
      ) : (
        games.map((game) => (
          <div key={game.id} className="grid-item">
            <Link
              href={`/games/${game.id}`}
              passHref
              prefetch
              scroll={true}
            >
              <div className="cover-container">
                {game.cover && game.cover.image_id ? (
                  <>
                    <div>
                      <img
                        className="cover-image"
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
                        alt={game.name}
                      />
                    </div>
                    <div className="main-image">
                      <img
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
                        alt={game.name}
                        width={250}
                        height={325}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                )}
                <div className="overlay">
                  <Typography
                    variant="h6"
                    color="white"
                    fontSize={20}
                    align="center"
                  >
                    {game.name}
                  </Typography>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  </Box>
  );
};

export default GameCards;
