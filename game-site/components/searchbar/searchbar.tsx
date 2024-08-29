// components/SearchBar.tsx

import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import "../../app/globals.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch(''); // Clear search results when query is cleared
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ marginTop: '30px' }} className="flex justify-center my-6"> {/* Adjusted margin */}
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <>
              {query && (
                <IconButton onClick={handleClear} edge="end">
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton onClick={handleSearch} edge="end">
                <SearchIcon />
              </IconButton>
            </>
          ),
          sx: {
            backgroundColor: 'white',
            '& .MuiInputBase-input': {
              color: 'black',
            },
            '& .MuiInputLabel-root': {
              color: 'black',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default SearchBar;
