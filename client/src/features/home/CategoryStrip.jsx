// src/features/home/CategoryStrip.jsx
import { Box, Typography, Paper, Stack, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CategoryStrip({ categories, loading }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 3, md: 0 },
        maxWidth: 1200,
        mx: "auto",
        mt: { xs: 3, md: 5 },
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2, md: 3 }}
        textAlign={{ xs: "center", md: "left" }}
      >
        Shop by Category
      </Typography>

      <Stack
        direction="row"
        spacing={{ xs: 1.5, sm: 2 }}
        overflow="auto"
        pb={2}
        sx={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={120}
                height={44}
                sx={{
                  borderRadius: 3,
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                }}
              />
            ))
          : categories.map((cat) => (
              <Paper
                key={cat}
                onClick={() => navigate(`/category/${cat}`)}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.2, sm: 1.6 },
                  minWidth: { xs: 120, sm: 140 },
                  borderRadius: 3,
                  flexShrink: 0,
                  textAlign: "center",
                  cursor: "pointer",
                  scrollSnapAlign: "start",
                  transition: "background-color 0.2s, box-shadow 0.2s",

                  // Touch-first behavior
                  "&:active": {
                    bgcolor: "grey.100",
                  },

                  // Hover only on devices that support it
                  "@media (hover: hover)": {
                    "&:hover": {
                      boxShadow: 4,
                      bgcolor: "#eef",
                    },
                  },
                }}
              >
                <Typography
                  fontWeight={600}
                  fontSize={{ xs: "0.85rem", sm: "0.95rem" }}
                  noWrap
                >
                  {cat}
                </Typography>
              </Paper>
            ))}
      </Stack>
    </Box>
  );
}
