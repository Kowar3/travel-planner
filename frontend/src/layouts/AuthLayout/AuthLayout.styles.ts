export const s = {
  container: {
    minH: "100vh",
    w: "full",
    align: "center",
    justify: "center",
    bg: { base: "gray.50", _dark: "gray.950" },
    position: "relative" as const,
    overflow: "hidden",
    px: 4,
    bgGradient: {
      base: `radial-gradient(at 0% 0%, rgba(20, 184, 166, 0.1) 0px, transparent 50%), 
             radial-gradient(at 100% 100%, rgba(45, 212, 191, 0.1) 0px, transparent 50%)`,
      _dark: `radial-gradient(at 0% 0%, rgba(20, 184, 166, 0.05) 0px, transparent 40%), 
              radial-gradient(at 100% 100%, rgba(45, 212, 191, 0.05) 0px, transparent 40%)`,
    },
  },

  themeTogglePos: {
    position: "absolute" as const,
    top: { base: 4, md: 8 },
    right: { base: 4, md: 8 },
    zIndex: 10,
  },

  logoText: {
    fontSize: "4xl",
    fontWeight: "black",
    letterSpacing: "tighter",
    color: "teal.600",
    _dark: { color: "teal.500" },
    lineHeight: "shorter",
  },

  lineUnderHeading: {
    h: "1",
    w: "12",
    bg: "teal.400",
    borderRadius: "full",
  },

  circleTop: {
    size: "400px",
    bg: { base: "teal.50", _dark: "teal.900" },
    opacity: { base: 1, _dark: 0.15 },
    position: "absolute" as const,
    top: "-100px",
    right: "-100px",
    blur: "80px",
    zIndex: 0,
  },

  circleBottom: {
    size: "300px",
    bg: { base: "blue.50", _dark: "blue.900" },
    opacity: { base: 1, _dark: 0.15 },
    position: "absolute" as const,
    bottom: "-50px",
    left: "-50px",
    blur: "60px",
    zIndex: 0,
  },
};
