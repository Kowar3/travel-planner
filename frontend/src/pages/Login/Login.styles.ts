export const loginStyles = {
  card: {
    gap: 6,
    width: "100%",
    p: { base: 6, md: 10 },
    bg: { base: "white", _dark: "gray.900" },
    borderRadius: "3xl",
    boxShadow: {
      base: "0 20px 40px -12px rgba(0, 0, 0, 0.1)",
      _dark: "0 20px 40px rgba(0,0,0,0.5)",
    },
    border: "1px solid",
    borderColor: { base: "gray.50", _dark: "whiteAlpha.100" },
  },

  logo: {
    h: "100px",
    w: "auto",
    transition: "all 0.2s",
    filter: {
      base: "drop-shadow(0 10px 15px rgba(20, 184, 166, 0.4))",
      _dark: "drop-shadow(0 10px 25px rgba(20, 184, 166, 0.6))",
    },
  },

  heading: {
    size: "2xl" as const,
    fontWeight: "black",
    color: { base: "gray.800", _dark: "white" },
  },

  text: {
    color: { base: "gray.400", _dark: "gray.500" },
    fontSize: "sm",
    fontWeight: "medium" as const,
  },

  input: (isInvalid: boolean) => ({
    bg: { base: "gray.50", _dark: "whiteAlpha.50" },
    h: "12",
    borderRadius: "xl",
    border: "2px solid",
    borderColor: "transparent",
    _focus: {
      bg: { base: "white", _dark: "gray.800" },
      borderColor: isInvalid ? "red.500" : "teal.500",
      ring: "none",
    },
  }),

  button: {
    colorPalette: "teal" as const,
    size: "lg" as const,
    width: "full",
    h: "14",
    mt: 2,
    borderRadius: "xl",
    fontWeight: "bold",
    _hover: {
      transform: "translateY(-1px)",
      boxShadow: "lg",
      _dark: { bg: "teal.600" },
    },
  },

  errorBox: {
    w: "full",
    p: 3,
    bg: "red.50",
    _dark: { bg: "red.900/20" },
    borderLeft: "4px solid",
    borderColor: "red.500",
    borderRadius: "md",
  },
};
