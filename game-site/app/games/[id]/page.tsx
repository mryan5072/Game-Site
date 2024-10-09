"use client";

import React, { useEffect } from 'react';

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

  const fetchGameDetails = async (id: string) => {
    console.log('Fetching game details for ID:', id);
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + `/api/getGame?id=${id}`, {
      method: 'POST',
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      console.error('Error fetching game details:', res.statusText);
      return null; 
    }

    const gameDetails: Game = await res.json();
    console.log('Game details fetched:', gameDetails);
    return gameDetails; 
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  const gameDetails: Game | null = await fetchGameDetails(params.id);

  return (
    <div className="game-details-container">
      {gameDetails?.cover ? (
        <img
          className="cover-image"
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${gameDetails.cover.image_id}.jpg`}
          alt={gameDetails.name}
        />
      ) : (
        <div className="cover-image"></div>
      )}
      <div className="flex flex-col">
        <h1 className="game-title">{gameDetails?.name}</h1>
        <p className="game-summary">{gameDetails?.summary || 'No summary available'}</p>
      </div>
    </div>
  );
}
