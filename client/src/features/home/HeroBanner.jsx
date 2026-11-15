import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      className="lux-hero"
      aria-labelledby="hero-title"
      sx={{
        backgroundImage:
          "linear-gradient(90deg, rgba(8,8,8,.95) 0%, rgba(8,8,8,.78) 42%, rgba(8,8,8,.18) 100%), linear-gradient(0deg, rgba(8,8,8,.38), transparent 40%), url('https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2200&q=85')",
      }}
    >
      <div className="lux-container hero-content lux-reveal">
        <span className="lux-eyebrow">Technology, thoughtfully chosen</span>
        <Typography id="hero-title" component="h1" className="hero-title">
          Find Your Next<br />Tech Obsession
        </Typography>
        <Typography className="hero-description">
          Discover the latest in technology, innovation and performance.
        </Typography>
        <Button
          className="hero-cta"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/products")}
        >
          Explore all products
        </Button>
      </div>
      <div className="hero-caption">Curated essentials for modern living</div>
    </Box>
  );
}
