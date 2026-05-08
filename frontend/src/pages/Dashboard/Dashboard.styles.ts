export const dashboardStyles = {
  container: { p: { base: 4, md: 0 } },

  headerLabel: {
    fontSize: "xs",
    color: "teal.600",
    fontWeight: "black",
    letterSpacing: "widest",
  },

  mainHeading: {
    size: "2xl" as const,
    fontWeight: "black",
    color: { base: "gray.800", _dark: "white" },
  },

  cardRoot: {
    borderRadius: "3xl",
    border: "none",
    shadow: "xl",
    bg: { base: "white", _dark: "gray.900" },
    overflow: "hidden",
  },

  nextAdventureHeader: {
    bgGradient: "to-br",
    gradientFrom: "teal.600",
    gradientTo: "teal.700",
    p: 5,
  },

  badge: {
    variant: "solid" as const,
    bg: "whiteAlpha.300",
    borderRadius: "full",
    px: 5,
    py: 2,
    fontSize: "md",
    color: "white",
  },

  detailsButton: {
    colorPalette: "teal",
    variant: "surface" as const,
    borderRadius: "xl",
  },

  chartGrid: (isDark: boolean) => ({
    strokeDasharray: "3 3",
    vertical: false,
    stroke: isDark ? "whiteAlpha.100" : "gray.100",
  }),

  chartsBox: {
    h: "300px",
    w: "100%",
    minW: 0,
    position: "relative",
  },

  xaxis: {
    axisLine: false,
    tickLine: false,
    fontSize: 10,
    angle: -25,
    textAnchor: "end" as const,
  },
};
