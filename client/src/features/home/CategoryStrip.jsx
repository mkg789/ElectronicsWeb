// src/features/home/CategoryStrip.jsx
import { Box, Typography, Paper, Stack, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CategoryStrip({ categories, loading }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, sm: 5 }, maxWidth: 1200, mx: "auto", mt: 5 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Shop by Category
      </Typography>

      <Stack direction="row" spacing={2} overflow="auto" pb={2}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={140}
                height={50}
                sx={{ borderRadius: 3 }}
              />
            ))
          : categories.map((cat) => (
              <Paper
                key={cat}
                onClick={() => navigate(`/category/${cat}`)}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  minWidth: 140,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-3px)",
                    bgcolor: "#eef",
                  },
                }}
              >
                <Typography fontWeight={600}>{cat}</Typography>
              </Paper>
            ))}
      </Stack>
    </Box>
  );
}
