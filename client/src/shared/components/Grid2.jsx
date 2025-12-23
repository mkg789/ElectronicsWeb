import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";

// Convert 12-column value to percentage width
function getWidth(val) {
  if (val == null) return undefined;
  const v = Number(val);
  if (Number.isNaN(v) || v <= 0) return undefined;
  return `${(v / 12) * 100}%`;
}

export default function Grid2({
  container = false,
  spacing = 0,
  rowSpacing,
  columnSpacing,
  wrap = "wrap",
  justifyContent = "flex-start",
  alignItems = "stretch",
  children,
  xs,
  sm,
  md,
  lg,
  sx = {},
  ...rest
}) {
  const theme = useTheme();

  if (container) {
    const gapX = columnSpacing ?? spacing;
    const gapY = rowSpacing ?? spacing;

    const gapXPx = typeof gapX === "number" ? theme.spacing(gapX) : gapX;
    const gapYPx = typeof gapY === "number" ? theme.spacing(gapY) : gapY;

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: wrap,
          justifyContent,
          alignItems,
          margin: `-${gapYPx} 0 0 -${gapXPx}`,
          "& > *": {
            padding: `${gapYPx} 0 0 ${gapXPx}`,
          },
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  }

  // Item
  const sxResponsive = {
    boxSizing: "border-box",
    flexGrow: 0,
    flexBasis: {
      ...(xs ? { xs: getWidth(xs) } : {}),
      ...(sm ? { sm: getWidth(sm) } : {}),
      ...(md ? { md: getWidth(md) } : {}),
      ...(lg ? { lg: getWidth(lg) } : {}),
    },
    maxWidth: {
      ...(xs ? { xs: getWidth(xs) } : {}),
      ...(sm ? { sm: getWidth(sm) } : {}),
      ...(md ? { md: getWidth(md) } : {}),
      ...(lg ? { lg: getWidth(lg) } : {}),
    },
    ...sx,
  };

  return (
    <Box sx={sxResponsive} {...rest}>
      {children}
    </Box>
  );
}

Grid2.propTypes = {
  container: PropTypes.bool,
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  columnSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  wrap: PropTypes.oneOf(["wrap", "nowrap", "wrap-reverse"]),
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string,
  children: PropTypes.node,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sx: PropTypes.object,
};
