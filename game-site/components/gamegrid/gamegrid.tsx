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
  width: '225px', // Fixed width to match the main image
  height: '300px', // Fixed height to match the main image
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .cover-image': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
    filter: 'blur(10px)',
    zIndex: 1,
  },
  '& .main-image': {
    position: 'relative',
    width: '100%',
    height: '100%',
    objectFit: 'contain', // Adjust this based on your layout needs
    zIndex: 2,
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
    zIndex: 3,
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

  const fetchGames = async (page: number, query: string, platform: string, category: string, genre: string, sortBy: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/getGames?page=${page}&limit=20&search=${encodeURIComponent(query)}&platform=${platform}&category=${category}&genre=${genre}&sortby=${sortBy}`, {
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
    fetchGames(page, searchQuery, platform, category, genre, sortBy);
  }, [page, searchQuery, platform, category, genre, sortBy]);

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
                  <div className="cover-container">
                    {game.cover && game.cover.image_id ? (
                      <>
                        <img
                          className="cover-image"
                          src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`}
                          alt={game.name}
                        />
                        <div className="main-image">
                          <img
                            src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`}
                            alt={game.name}
                            width={225}
                            height={300}
                            style={{ objectFit: 'contain' }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </>
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
              <MenuItem value="adventure">Adventure</MenuItem>
              <MenuItem value="arcade">Arcade</MenuItem>
              <MenuItem value="brawler">Brawler</MenuItem>
              <MenuItem value="card-and-board-game">Card & Board Game</MenuItem>
              <MenuItem value="fighting">Fighting</MenuItem>
              <MenuItem value="indie">Indie</MenuItem>
              <MenuItem value="moba">MOBA</MenuItem>
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="point-and-click">Point & Click</MenuItem>
              <MenuItem value="shooter">Shooter</MenuItem>
              <MenuItem value="platform">Platform</MenuItem>
              <MenuItem value="puzzle">puzzle</MenuItem>
              <MenuItem value="racing">Racing</MenuItem>
              <MenuItem value="real-time-strategy-rts">Real Time Strategy (RTS)</MenuItem>
              <MenuItem value="role-playing-rpg">Role Playing Game (RPG)</MenuItem>
              <MenuItem value="simulator">Simulator</MenuItem>
              <MenuItem value="sport">Sport</MenuItem>
              <MenuItem value="strategy">Strategy</MenuItem>
              <MenuItem value="turn-based-stategy-tbs">Turn Based Strategy (TBS)</MenuItem>
              <MenuItem value="hack-and-slash-beat-em-up">Hack and Slash/Beat &#39;em up</MenuItem>
              <MenuItem value="quiz-trivia">Quiz/Trivia</MenuItem>
              <MenuItem value="pinball">Pinball</MenuItem>
              <MenuItem value="visual-novel">Visual Novel</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={tempCategory} onChange={(e) => setTempCategory(e.target.value)}>
              <MenuItem value="0">Main Game</MenuItem>
              <MenuItem value="1">DLC Addon</MenuItem>
              <MenuItem value="2">Expansion</MenuItem>
              <MenuItem value="3">Bundle</MenuItem>
              <MenuItem value="4">Standalone Expansion</MenuItem>
              <MenuItem value="5">Mod</MenuItem>
              <MenuItem value="6">Episode</MenuItem>
              <MenuItem value="7">Season</MenuItem>
              <MenuItem value="8">Remake</MenuItem>
              <MenuItem value="9">Remaster</MenuItem>
              <MenuItem value="10">Expanded Game</MenuItem>
              <MenuItem value="11">Port</MenuItem>
              <MenuItem value="12">Fork</MenuItem>
              <MenuItem value="13">Pack</MenuItem>
              <MenuItem value="14">Update</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Platform</InputLabel>
            <Select value={tempPlatform} onChange={(e) => setTempPlatform(e.target.value)}>
            <MenuItem value="3">Linux</MenuItem>
            <MenuItem value="4">Nintendo 64</MenuItem>
            <MenuItem value="5">Wii</MenuItem>
            <MenuItem value="6">PC (Microsoft Windows)</MenuItem>
            <MenuItem value="7">PlayStation</MenuItem>
            <MenuItem value="8">PlayStation 2</MenuItem>
            <MenuItem value="9">PlayStation 3</MenuItem>
            <MenuItem value="11">Xbox</MenuItem>
            <MenuItem value="12">Xbox 360</MenuItem>
            <MenuItem value="13">PC DOS</MenuItem>
            <MenuItem value="14">Mac</MenuItem>
            <MenuItem value="15">Commodore C64/128</MenuItem>
            <MenuItem value="16">Amiga</MenuItem>
            <MenuItem value="18">Nintendo Entertainment System (NES)</MenuItem>
            <MenuItem value="19">Super Nintendo Entertainment System (SNES)</MenuItem>
            <MenuItem value="20">Nintendo DS</MenuItem>
            <MenuItem value="21">Nintendo GameCube</MenuItem>
            <MenuItem value="22">Game Boy Color</MenuItem>
            <MenuItem value="23">Dreamcast</MenuItem>
            <MenuItem value="24">Game Boy Advance</MenuItem>
            <MenuItem value="25">Amstrad CPC</MenuItem>
            <MenuItem value="26">ZX Spectrum</MenuItem>
            <MenuItem value="27">MSX</MenuItem>
            <MenuItem value="29">Sega Mega Drive/Genesis</MenuItem>
            <MenuItem value="30">Sega 32X</MenuItem>
            <MenuItem value="32">Sega Saturn</MenuItem>
            <MenuItem value="33">Game Boy</MenuItem>
            <MenuItem value="34">Android</MenuItem>
            <MenuItem value="35">Sega Game Gear</MenuItem>
            <MenuItem value="36">Xbox Live Arcade</MenuItem>
            <MenuItem value="37">Nintendo 3DS</MenuItem>
            <MenuItem value="38">PlayStation Portable</MenuItem>
            <MenuItem value="39">iOS</MenuItem>
            <MenuItem value="41">Wii U</MenuItem>
            <MenuItem value="42">N-Gage</MenuItem>
            <MenuItem value="44">Tapwave Zodiac</MenuItem>
            <MenuItem value="45">PlayStation Network</MenuItem>
            <MenuItem value="46">PlayStation Vita</MenuItem>
            <MenuItem value="47">Virtual Console (Nintendo)</MenuItem>
            <MenuItem value="48">PlayStation 4</MenuItem>
            <MenuItem value="49">Xbox One</MenuItem>
            <MenuItem value="50">3DO Interactive Multiplayer</MenuItem>
            <MenuItem value="51">Family Computer Disk System</MenuItem>
            <MenuItem value="52">Arcade</MenuItem>
            <MenuItem value="53">MSX2</MenuItem>
            <MenuItem value="55">Mobile</MenuItem>
            <MenuItem value="56">WiiWare</MenuItem>
            <MenuItem value="57">WonderSwan</MenuItem>
            <MenuItem value="58">Super Famicom</MenuItem>
            <MenuItem value="59">Atari 2600</MenuItem>
            <MenuItem value="60">Atari 7800</MenuItem>
            <MenuItem value="61">Atari Lynx</MenuItem>
            <MenuItem value="62">Atari Jaguar</MenuItem>
            <MenuItem value="63">Atari ST/STE</MenuItem>
            <MenuItem value="64">Sega Master System</MenuItem>
            <MenuItem value="65">Atari 8-bit</MenuItem>
            <MenuItem value="66">Atari 5200</MenuItem>
            <MenuItem value="67">Intellivision</MenuItem>
            <MenuItem value="68">ColecoVision</MenuItem>
            <MenuItem value="69">BBC Microcomputer System</MenuItem>
            <MenuItem value="70">Vectrex</MenuItem>
            <MenuItem value="71">Commodore VIC-20</MenuItem>
            <MenuItem value="72">Ouya</MenuItem>
            <MenuItem value="73">BlackBerry OS</MenuItem>
            <MenuItem value="74">Windows Phone</MenuItem>
            <MenuItem value="75">Apple II</MenuItem>
            <MenuItem value="77">Sharp X1</MenuItem>
            <MenuItem value="78">Sega CD</MenuItem>
            <MenuItem value="79">Neo Geo MVS</MenuItem>
            <MenuItem value="80">Neo Geo AES</MenuItem>
            <MenuItem value="82">Web browser</MenuItem>
            <MenuItem value="84">SG-1000</MenuItem>
            <MenuItem value="85">Donner Model 30</MenuItem>
            <MenuItem value="86">TurboGrafx-16/PC Engine</MenuItem>
            <MenuItem value="87">Virtual Boy</MenuItem>
            <MenuItem value="88">Odyssey</MenuItem>
            <MenuItem value="89">Microvision</MenuItem>
            <MenuItem value="90">Commodore PET</MenuItem>
            <MenuItem value="91">Bally Astrocade</MenuItem>
            <MenuItem value="92">SteamOS</MenuItem>
            <MenuItem value="93">Commodore 16</MenuItem>
            <MenuItem value="94">Commodore Plus/4</MenuItem>
            <MenuItem value="95">PDP-1</MenuItem>
            <MenuItem value="96">PDP-10</MenuItem>
            <MenuItem value="97">PDP-8</MenuItem>
            <MenuItem value="98">DEC GT40</MenuItem>
            <MenuItem value="99">Family Computer (FAMICOM)</MenuItem>
            <MenuItem value="100">Analogue electronics</MenuItem>
            <MenuItem value="101">Ferranti Nimrod Computer</MenuItem>
            <MenuItem value="102">EDSAC</MenuItem>
            <MenuItem value="103">PDP-7</MenuItem>
            <MenuItem value="104">HP 2100</MenuItem>
            <MenuItem value="105">HP 3000</MenuItem>
            <MenuItem value="106">SDS Sigma 7</MenuItem>
            <MenuItem value="107">Call-A-Computer time-shared mainframe computer system</MenuItem>
            <MenuItem value="108">PDP-11</MenuItem>
            <MenuItem value="109">CDC Cyber 70</MenuItem>
            <MenuItem value="110">PLATO</MenuItem>
            <MenuItem value="111">Imlac PDS-1</MenuItem>
            <MenuItem value="112">Microcomputer</MenuItem>
            <MenuItem value="113">OnLive Game System</MenuItem>
            <MenuItem value="114">Amiga CD32</MenuItem>
            <MenuItem value="115">Apple IIGS</MenuItem>
            <MenuItem value="116">Acorn Archimedes</MenuItem>
            <MenuItem value="117">Philips CD-i</MenuItem>
            <MenuItem value="118">FM Towns</MenuItem>
            <MenuItem value="119">Neo Geo Pocket</MenuItem>
            <MenuItem value="120">Neo Geo Pocket Color</MenuItem>
            <MenuItem value="121">Sharp X68000</MenuItem>
            <MenuItem value="122">Nuon</MenuItem>
            <MenuItem value="123">WonderSwan Color</MenuItem>
            <MenuItem value="124">SwanCrystal</MenuItem>
            <MenuItem value="125">PC-8801</MenuItem>
            <MenuItem value="126">TRS-80</MenuItem>
            <MenuItem value="127">Fairchild Channel F</MenuItem>
            <MenuItem value="128">PC Engine SuperGrafx</MenuItem>
            <MenuItem value="129">Texas Instruments TI-99</MenuItem>
            <MenuItem value="130">Nintendo Switch</MenuItem>
            <MenuItem value="131">Nintendo PlayStation</MenuItem>
            <MenuItem value="132">Amazon Fire TV</MenuItem>
            <MenuItem value="133">Philips Videopac G7000</MenuItem>
            <MenuItem value="134">Acorn Electron</MenuItem>
            <MenuItem value="135">Hyper Neo Geo 64</MenuItem>
            <MenuItem value="136">Neo Geo CD</MenuItem>
            <MenuItem value="137">New Nintendo 3DS</MenuItem>
            <MenuItem value="138">VC 4000</MenuItem>
            <MenuItem value="139">1292 Advanced Programmable Video System</MenuItem>
            <MenuItem value="140">AY-3-8500</MenuItem>
            <MenuItem value="141">AY-3-8610</MenuItem>
            <MenuItem value="142">PC-50X Family</MenuItem>
            <MenuItem value="149">PC-98</MenuItem>
            <MenuItem value="150">Turbografx-16/PC Engine CD</MenuItem>
            <MenuItem value="151">TRS-80 Color Computer</MenuItem>
            <MenuItem value="152">FM-7</MenuItem>
            <MenuItem value="153">Dragon 32/64</MenuItem>
            <MenuItem value="154">Amstrad PCW</MenuItem>
            <MenuItem value="155">Tatung Einstein</MenuItem>
            <MenuItem value="156">Thomson MO5</MenuItem>
            <MenuItem value="157">NEC PC-6000 Series</MenuItem>
            <MenuItem value="158">Commodore CDTV</MenuItem>
            <MenuItem value="159">Nintendo DSi</MenuItem>
            <MenuItem value="160">Nintendo eShop</MenuItem>
            <MenuItem value="161">Windows Mixed Reality</MenuItem>
            <MenuItem value="162">Oculus VR</MenuItem>
            <MenuItem value="163">SteamVR</MenuItem>
            <MenuItem value="164">Daydream</MenuItem>
            <MenuItem value="165">PlayStation VR</MenuItem>
            <MenuItem value="166">Pokemon Mini</MenuItem>
            <MenuItem value="167">PlayStation 5</MenuItem>
            <MenuItem value="169">Xbox Series</MenuItem>
            <MenuItem value="170">Google Stadia</MenuItem>
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
