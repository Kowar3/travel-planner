export const tripStyles = {
  container: {
    p: { base: 4, md: 0 },
  },

  headerStack: {
    direction: { base: "column", sm: "row" },
    justify: "space-between",
    mb: 30,
  } as const,

  badgeText: {
    fontWeight: "bold",
    fontSize: "xs",
    letterSpacing: "widest",
    color: "teal.500",
  },

  addButton: {
    colorPalette: "teal",
    size: "lg" as const,
    borderRadius: "xl",
  },

  toolbar: {
    direction: { base: "column", lg: "row" },
    gap: 4,
    mb: 10,
    bg: { base: "gray.50", _dark: "whiteAlpha.50" },
    p: 4,
    borderRadius: "2xl",
  } as const,

  searchBox: {
    flex: 1,
    bg: { base: "white", _dark: "gray.800" },
    borderRadius: "xl",
    px: 4,
    py: 2,
    border: "1px solid",
    borderColor: "gray.200",
  },

  select: {
    padding: "10px",
    borderRadius: "12px",
    background: "var(--chakra-colors-bg-panel)",
    border: "1px solid var(--chakra-colors-border)",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "150px",
  },

  pagination: {
    justify: "center",
    mt: 12,
    gap: 4,
    pb: 10,
  },
};
