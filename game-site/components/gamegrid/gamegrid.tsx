"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Grid, Pagination, CircularProgress, Typography } from '@mui/material';

interface Game {
  id: number;
  name: string;
  cover: number;
  image_id?: string;
}

const GameGrid: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchGames = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching games for page: ${page}`);
      const response = await fetch(`/api/getGames?page=${page}&limit=20`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data.games);
      setTotalPages(data.totalPages);
      console.log(`Fetched games:`, data.games);
      console.log(`Total pages:`, data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(page);
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(`Page changed to: ${value}`);
    setPage(value);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Grid container spacing={4} padding={2}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.id} textAlign="center">
            <div className="relative group w-full max-w-[300px] mx-auto">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                {game.cover && game.image_id ? (
                  <Image
                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.image_id}.jpg`}
                    alt={game.name}
                    width={300}
                    height={450}
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200" style={{ width: 300, height: 450 }}></div>
                )}
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Typography variant="h6" color="white" className="text-center">
                    {game.name}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

      <div className="flex justify-center items-center p-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};

export default GameGrid;
