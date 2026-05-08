export const protectedStyles = {
  container: {
    h: "100vh",
    w: "100vw",
    bg: { base: "gray.50", _dark: "gray.950" },
  },

  iconBox: {
    bg: "teal.500",
    p: 3,
    borderRadius: "xl",
    shadow: {
      base: "0 10px 20px rgba(20, 184, 166, 0.3)",
      _dark: "0 10px 30px rgba(20, 184, 166, 0.5)",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  spinner: {
    color: "teal.500",
    size: "xl" as const,
    borderWidth: "4px",
    animationDuration: "0.8s",
  },

  text: {
    fontWeight: "bold",
    color: { base: "gray.500", _dark: "gray.400" },
    letterSpacing: "widest",
    fontSize: "xs",
    textAlign: "center" as const,
  },
};
