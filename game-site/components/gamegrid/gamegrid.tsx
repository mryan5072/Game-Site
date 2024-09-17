"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Pagination,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchBar from '../searchbar/searchbar';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';
import "../../app/globals.css";

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  justifyContent: 'center',
  maxWidth: '1700px',
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
  cover?: {
    id: number;
    image_id: string;
  };
}

const GameGrid: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('rating_desc');
  const [genre, setGenre] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');

  // Temporary state variables for filters
  const [tempSortBy, setTempSortBy] = useState<string>('desc');
  const [tempGenre, setTempGenre] = useState<string>('');
  const [tempCategory, setTempCategory] = useState<string>('');
  const [tempPlatform, setTempPlatform] = useState<string>('');

  const fetchGames = async (page: number, query: string, platform: string, sortBy: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/getGames?page=${page}&limit=20&search=${encodeURIComponent(query)}&platform=${platform}&sortby=${sortBy}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to fetch games');
    
      const data = await response.json();
      setGames(data.games || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(page, searchQuery, platform, sortBy);
  }, [page, searchQuery, platform, sortBy]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterClick = () => {
    // Set temporary state variables to current filter values
    setTempSortBy(sortBy);
    setTempGenre(genre);
    setTempCategory(category);
    setTempPlatform(platform);
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const applyFilters = () => {
    // Apply the filters using temporary state variables
    setSortBy(tempSortBy);
    setGenre(tempGenre);
    setCategory(tempCategory);
    setPlatform(tempPlatform);
    setPage(1); // Reset to the first page when applying new filters
    setFilterOpen(false);
  };

  const clearFilters = () => {
    // Clear all filter parameters
    setTempSortBy('desc');
    setTempGenre('');
    setTempCategory('');
    setTempPlatform('');
    setSortBy('desc');
    setGenre('');
    setCategory('');
    setPlatform('');
    setPage(1); // Reset to the first page when clearing filters
    setFilterOpen(false);
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <SearchBar onSearch={handleSearch} />
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>       
        </div>
      </Box>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      )}
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
                  <div style={{ 
                    position: 'relative', 
                    width: '225px', 
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {game.cover && game.cover.image_id ? (
                      <Image
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`}
                        alt={game.name}
                        width={225} // Set the width of the container
                        height={300} // Set the height of the container
                        layout="responsive" // Maintain aspect ratio
                        objectFit="contain" // Contain the image within the specified dimensions
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
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

      <Dialog open={filterOpen} onClose={handleFilterClose}>
        <DialogTitle>Filter Options</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sort by</InputLabel>
            <Select value={tempSortBy} onChange={(e) => setTempSortBy(e.target.value)}>
              <MenuItem value="release_date_desc">Release Date (Newest)</MenuItem>
              <MenuItem value="release_date_asc">Release Date (Oldest)</MenuItem>
              <MenuItem value="rating_desc">Rating (Desc.)</MenuItem>
              <MenuItem value="rating_asc">Rating (Asc.)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Genre</InputLabel>
            <Select value={tempGenre} onChange={(e) => setTempGenre(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {/* Add more genre options here */}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={tempCategory} onChange={(e) => setTempCategory(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {/* Add more category options here */}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Platform</InputLabel>
            <Select value={tempPlatform} onChange={(e) => setTempPlatform(e.target.value)}>
              <MenuItem value="6">PC (Windows)</MenuItem>
              <MenuItem value="7">PlayStation</MenuItem>
              <MenuItem value="8">PlayStation 2</MenuItem>
              <MenuItem value="9">PlayStation 3</MenuItem>
              <MenuItem value="48">PlayStation 4</MenuItem>
              <MenuItem value="167">PlayStation 5</MenuItem>
              <MenuItem value="49">Xbox One</MenuItem>
              {/* Add more platform options here */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Clear Filters</Button>
          <Button onClick={applyFilters} color="primary">Apply Filters</Button>
          <Button onClick={handleFilterClose} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GameGrid;
