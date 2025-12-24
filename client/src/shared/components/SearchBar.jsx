// src/shared/components/SearchBar.jsx
import { useState, useEffect, useRef } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  fullWidth = false,
  autoFocus = false,
  initialValue = "",
  onQueryChange, // optional: live search callback
  placeholder = "Search products…",
}) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Sync when parent updates initialValue (e.g., URL changes)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounce live query callback
  useEffect(() => {
    if (!onQueryChange) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onQueryChange(query.trim());
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, onQueryChange]);

  const runSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : 300 }}>
      <TextField
        fullWidth
        size="small"
        autoFocus={autoFocus}
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <IconButton size="small" onClick={() => setQuery("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton onClick={runSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
