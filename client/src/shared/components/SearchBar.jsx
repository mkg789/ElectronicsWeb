import { useState } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ fullWidth = false }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = (query || "").trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
      <TextField
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        fullWidth={fullWidth}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="search">
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
