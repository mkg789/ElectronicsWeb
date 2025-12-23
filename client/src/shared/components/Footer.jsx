import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 3,
        mt: 6,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Zyntrica. All rights reserved.
      </Typography>
    </Box>
  );
}
