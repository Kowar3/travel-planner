export const registerStyles = {
  card: {
    width: "100%",
    p: { base: 6, md: 10 },
    borderRadius: "3xl",
    bg: { base: "white", _dark: "gray.900" },
    border: "1px solid",
    borderColor: { base: "gray.100", _dark: "whiteAlpha.100" },
    boxShadow: { base: "xl", _dark: "0 20px 40px rgba(0,0,0,0.5)" },
  },

  heading: {
    fontWeight: "black",
    color: { base: "gray.800", _dark: "white" },
  },

  text: {
    fontSize: "sm",
    fontWeight: "medium",
    color: { base: "gray.500", _dark: "gray.400" },
  },

  button: {
    variant: "solid" as const,
    colorPalette: "teal",
    h: "14",
    w: "full",
    borderRadius: "xl",
    fontWeight: "bold",
    _hover: { transform: "translateY(-2px)" },
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
