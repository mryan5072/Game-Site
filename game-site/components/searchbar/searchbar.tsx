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
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ marginTop: '30px' }} className="flex justify-center my-6">
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          // Change the label color (the "Search" text above the field)
          '& .MuiInputLabel-root': {
            color: 'white', // Change this to your desired color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white', // Change this to your desired focused color
          },
          // Change the input text color
          '& .MuiInputBase-input': {
            color: 'white', // Change this to your desired color
          },
        }}
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
            backgroundColor: 'rgb(25, 25, 25)',
            // Change the outline color
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Change this to your desired color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Change this to your desired hover color
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Change this to your desired focused color
            },
            // You can also change the icon colors
            '& .MuiSvgIcon-root': {
              color: 'white', // Change this to your desired icon color
            },
          },
        }}
      />
    </div>
  );
};

export default SearchBar;