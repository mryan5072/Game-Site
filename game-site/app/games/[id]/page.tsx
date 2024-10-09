import React from 'react';

interface Game {
  id: number;
  name: string;
  cover?: {
    id: number;
    image_id: string;
  };
  summary?: string;
}

export default async function GameDetailsPage({ params }: { params: { id: string } }) {
  console.log('Fetching game details for ID:', params.id);

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + `/api/getGame?id=${params.id}`, {
    method: 'POST',
  });

  console.log('Response status:', res.status);

  if (!res.ok) {
    console.error('Error fetching game details:', res.statusText);
    return <p>No game details found</p>;
  }

  const gameDetails: Game = await res.json();
  console.log('Game details fetched:', gameDetails);

  return (
    <div className="game-details-container">
      {gameDetails.cover ? (
        <img
          className="cover-image"
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${gameDetails.cover.image_id}.jpg`}
          alt={gameDetails.name}
        />
      ) : (
        <div className="cover-image"></div> // Placeholder for missing image
      )}
      <div className="flex flex-col">
        <h1 className="game-title">{gameDetails.name}</h1> {/* Title */}
        <p className="game-summary">{gameDetails.summary || 'No summary available'}</p> {/* Summary */}
      </div>
    </div>
  );
}
