import { Box, CircularProgress, useTheme } from "@mui/material";
import PropTypes from "prop-types";

export default function Loader({ fullPage = false, size, color = "primary" }) {
  const theme = useTheme();

  if (fullPage) {
    return (
      <Box
        sx={{
          height: "100vh", // full viewport height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={size || 64} color={color} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: theme.spacing(4),
      }}
    >
      <CircularProgress size={size || 32} color={color} />
    </Box>
  );
}

Loader.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
};
