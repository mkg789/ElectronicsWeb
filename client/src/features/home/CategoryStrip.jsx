import { Box, Skeleton, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const categoryVisuals = [
  ["laptop", "photo-1496181133206-80ce9b88a853"],
  ["phone", "photo-1511707171634-5f897ff02aa9"],
  ["audio", "photo-1505740420928-5e560c06d30e"],
  ["camera", "photo-1516035069371-29a1b244cc32"],
  ["game", "photo-1486572788966-cfd3df1f5b42"],
  ["tv", "photo-1593359677879-a4bb92f829d1"],
  ["accessor", "photo-1523275335684-37898b6baf30"],
];

function categoryImage(category) {
  const key = String(category).toLowerCase();
  const match = categoryVisuals.find(([keyword]) => key.includes(keyword));
  const image = match?.[1] || "photo-1498049794561-7780e7231661";
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=560&q=75`;
}

export default function CategoryStrip({ categories = [], loading }) {
  const navigate = useNavigate();

  return (
    <Box component="section" className="lux-section category-section" id="categories">
      <div className="lux-container">
        <div className="lux-section-heading">
          <div>
            <span className="lux-eyebrow">Explore the collection</span>
            <Typography component="h2" className="lux-heading">Shop by category</Typography>
          </div>
        </div>
        <Box className="category-rail">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" className="category-skeleton" />
              ))
            : categories.map((category) => (
                <button
                  type="button"
                  className="category-tile"
                  key={category}
                  onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                >
                  <img src={categoryImage(category)} alt="" loading="lazy" />
                  <span className="category-tile-shade" />
                  <span className="category-tile-name">{category}</span>
                  <ArrowForwardIcon className="category-tile-arrow" fontSize="small" />
                </button>
              ))}
        </Box>
      </div>
    </Box>
  );
}
