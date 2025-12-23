import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, InputBase, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ fullWidth = false }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery("");
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: fullWidth ? "100%" : { xs: "100%", sm: 300 },
        maxWidth: fullWidth ? "100%" : 300,
        borderRadius: 2,
        boxShadow: 1,
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ "aria-label": "search products" }}
      />
      <IconButton
        type="submit"
        sx={{ p: 1.5 }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
