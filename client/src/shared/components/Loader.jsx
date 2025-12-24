import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function Loader({
  fullPage = false,
  size = 32,
  color = "primary",
  message,
}) {
  const content = (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          minHeight: "100svh", // mobile-safe viewport height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
      {content}
    </Box>
  );
}

Loader.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
  message: PropTypes.string,
};
