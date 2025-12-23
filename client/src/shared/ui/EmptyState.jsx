import { Box, Typography } from "@mui/material";

export default function EmptyState({
  title = "Nothing here",
  subtitle,
}) {
  return (
    <Box textAlign="center" py={6}>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" mt={1}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
