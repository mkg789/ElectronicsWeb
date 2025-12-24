import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";

/* ---------------- Utils ---------------- */

function getWidth(val) {
  if (val === true) return "100%";
  if (val === "auto") return "auto";

  const v = Number(val);
  if (!Number.isFinite(v) || v <= 0) return undefined;

  return `${(v / 12) * 100}%`;
}

function buildResponsive(values) {
  return Object.fromEntries(
    Object.entries(values)
      .map(([bp, val]) => [bp, getWidth(val)])
      .filter(([, v]) => v != null)
  );
}

/* ---------------- Component ---------------- */

export default function Grid2({
  container = false,
  spacing = 0,
  rowSpacing,
  columnSpacing,
  wrap = "wrap",
  justifyContent = "flex-start",
  alignItems = "stretch",
  children,
  xs = 12,
  sm,
  md,
  lg,
  sx,
  ...rest
}) {
  const theme = useTheme();

  /* ---------- Container ---------- */

  if (container) {
    const gapX = columnSpacing ?? spacing;
    const gapY = rowSpacing ?? spacing;

    const gapXPx =
      typeof gapX === "number" ? theme.spacing(gapX) : gapX;
    const gapYPx =
      typeof gapY === "number" ? theme.spacing(gapY) : gapY;

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: wrap,
          justifyContent,
          alignItems,
          marginLeft: `-${gapXPx}`,
          marginTop: `-${gapYPx}`,
          width: "100%",
          "& > *": {
            paddingLeft: gapXPx,
            paddingTop: gapYPx,
          },
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  }

  /* ---------- Item ---------- */

  const responsiveWidth = buildResponsive({ xs, sm, md, lg });

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: responsiveWidth,
        maxWidth: responsiveWidth,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

/* ---------------- PropTypes ---------------- */

Grid2.propTypes = {
  container: PropTypes.bool,
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  columnSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  wrap: PropTypes.oneOf(["wrap", "nowrap", "wrap-reverse"]),
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string,
  children: PropTypes.node,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  sx: PropTypes.object,
};
