"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Pagination, CircularProgress, Typography } from '@mui/material';
import SearchBar from '../searchbar/searchbar';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import "../../app/globals.css";

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)', // 5 columns
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  justifyContent: 'center',
  maxWidth: '1700px', // Optional max width for centering effect
  margin: '0 auto',
}));

const GridItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '100%',
  height: 'auto',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '& .overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 1,
    },
  },
}));

interface Game {
  id: number;
  name: string;
  cover: {
    id: number;
    image_id: string;
  }
}

const GameGrid: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchGames = async (page: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching games for page: ${page} with query: ${query}`);
      const response = await fetch(`/api/getGames?page=${page}&limit=20&search=${encodeURIComponent(query)}`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      console.log(`Fetched data:`, data); // Debugging statement
      setGames(data.games || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(page, searchQuery);
  }, [page, searchQuery]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(`Page changed to: ${value}`);
    setPage(value);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {loading && <CircularProgress />}
      {error && <Typography color="error">Error: {error}</Typography>}

      {!loading && !error && (
        <>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <GridContainer>
              {games.length === 0 ? (
                <Typography>No games found</Typography>
              ) : (
                games.map((game) => (
                  <GridItem key={game.id}>
                    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                      {game.cover.image_id ? (
                        <Image
                          src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`}
                          alt={game.name}
                          width={320}
                          height={400}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0' }}></div>
                      )}
                      <div className="overlay">
                        <Typography variant="h6" color="white" fontSize={20} align='center'>
                          {game.name}
                        </Typography>
                      </div>
                    </div>
                  </GridItem>
                ))
              )}
            </GridContainer>
          </Box>
          <div className="flex justify-center items-center p-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: 'white',
                  color: '#000',
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: 'white',
                },
                '& .MuiPaginationItem-icon': {
                  color: 'white',
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GameGrid;
