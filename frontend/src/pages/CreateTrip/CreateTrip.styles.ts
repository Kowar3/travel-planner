export const createTripStyles = {
  container: {
    maxW: "1400px",
    mx: "auto",
    pt: 10,
    px: 6,
    pb: 20,
  },

  card: {
    borderRadius: "3xl",
    shadow: "2xl",
    border: "none",
    p: 4,
    bg: { base: "white", _dark: "gray.900" },
  },

  input: {
    size: "lg" as const,
    borderRadius: "xl",
    bg: { base: "gray.50", _dark: "whiteAlpha.50" },
    border: "none",
    color: { base: "gray.800", _dark: "white" },

    "&::-webkit-inner-spin-button": {
      display: "none",
      WebkitAppearance: "none",
      appearance: "none",
      margin: 0,
    },
  },

  mapWrapper: {
    w: "75%",
    h: { base: "50vh", lg: "700px" },
    minH: { base: "350px", lg: "700px" },
    borderRadius: "3xl",
    overflow: "hidden",
    shadow: "2xl",
    border: "4px solid",
    borderColor: "teal.500",
    position: "relative",
  },
  locationBox: (isActive: boolean, type: "start" | "end") => ({
    p: 4,
    borderRadius: "2xl",
    border: "2px solid",
    transition: "all 0.2s",
    cursor: "pointer",
    borderColor: isActive
      ? type === "start"
        ? "green.400"
        : "red.400"
      : { base: "transparent", _dark: "whiteAlpha.100" },
    bg: isActive
      ? {
          base: type === "start" ? "green.50" : "red.50",
          _dark: type === "start" ? "green.900/20" : "red.900/20",
        }
      : { base: "gray.50", _dark: "whiteAlpha.50" },
  }),

  chooseText: {
    fontWeight: "bold",
    lineClamp: 1,
    color: { base: "gray.800", _dark: "white" },
  },

  inputGroup: {
    width: "full",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    right: "16px",
    zIndex: 2,
    color: "gray.400",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    colorPalette: "teal",
    size: "xl" as const,
    h: "16",
    borderRadius: "2xl",
    fontWeight: "black",
  },
};
