// src/shared/components/SearchBar.jsx
import { useState, useEffect, useRef } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  fullWidth = false,
  autoFocus = false,
  onQueryChange,
  initialValue = "",
}) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Handle live search with debounce
  useEffect(() => {
    if (!onQueryChange) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onQueryChange(query.trim());
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, onQueryChange]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => setQuery("");

  // handle Enter key manually
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box
      component="div" // use div instead of form to avoid nested forms
      sx={{ display: "flex", width: fullWidth ? "100%" : { xs: "100%", sm: 300 } }}
    >
      <TextField
        size="small"
        fullWidth
        autoFocus={autoFocus}
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        inputProps={{
          "aria-label": "search products",
          enterKeyHint: "search",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <IconButton onClick={handleClear} size="small" aria-label="clear search">
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton onClick={handleSearch} aria-label="search" edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
    </Box>
  );
}
