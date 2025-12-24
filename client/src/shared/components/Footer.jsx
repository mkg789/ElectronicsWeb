import { Box, Typography, Stack, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: { xs: 3, sm: 4 },
        textAlign: "center",
        color: "text.secondary",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Stack
        spacing={1}
        alignItems="center"
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Zyntrica. All rights reserved.
        </Typography>

        <Stack
          direction="row"
          spacing={2}
        >
          <Link href="/privacy" underline="hover" color="inherit">
            Privacy
          </Link>
          <Link href="/terms" underline="hover" color="inherit">
            Terms
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
