"use client";

import React, { useState, useEffect } from "react";
import {
  Pagination,
  CircularProgress,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "../searchbar/searchbar";
import Box from "@mui/material/Box";
import "../../app/globals.css";
import GameCards from "../gamecards/gamecards";
import FilterMenu from "../filterMenu/filterMenu";

interface Game {
  id: number;
  name: string;
  cover?: {
    id: number;
    image_id: string;
  };
}

const GameGrid: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "rating_desc";
  const genre = searchParams.get("genre") || "";
  const category = searchParams.get("category") || "";
  const platform = searchParams.get("platform") || "";
  const limit = searchParams.get("limit") || "20";

  const fetchGames = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/getGames?page=${page}&search=${encodeURIComponent(
          query
        )}&limit=${limit}&platform=${platform}&category=${category}&genre=${genre}&sortby=${sortBy}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch games");

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
    window.scroll(0, 0);
    fetchGames(searchQuery);
  }, [page, searchQuery, platform, category, genre, sortBy, limit]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", value.toString());
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };

  const handleSearch = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("search", query);
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };

  const handlePageLimit = (newLimit: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("limit", newLimit);
    router.push(`?${newSearchParams.toString()}`, { scroll: true });
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <SearchBar onSearch={handleSearch} />
          <FilterMenu />
          <ToggleButtonGroup
           className="pageLimitToggle"
           onChange={(event: React.MouseEvent<HTMLElement>, newLimit: string | null) => {
            if (newLimit !== null) {
              handlePageLimit(newLimit);
            }
          }}
           exclusive>
            <ToggleButton value="20">20</ToggleButton>
            <ToggleButton value="40">40</ToggleButton>
            <ToggleButton value="60">60</ToggleButton>
            <ToggleButton value="80">80</ToggleButton>
          </ToggleButtonGroup>
        </div>
        </Box>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {error && <Typography color="error">Error: {error}</Typography>}
      {!loading && !error && (
        <GameCards games={games} />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "white",
              color: "#000",
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "white",
            },
            "& .MuiPaginationItem-icon": {
              color: "white",
            },
          }}
        />
      </div>
    </div>
  );
};

export default GameGrid;
