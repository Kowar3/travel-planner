export const profileStyles = {
  headerSection: {
    align: "start",
    gap: 1,
    mb: 8,
  },

  label: {
    fontSize: "xs",
    color: "teal.600",
    fontWeight: "black",
    letterSpacing: "widest",
  },

  mainCard: {
    borderRadius: "3xl",
    border: "none",
    shadow: "xl",
    bg: { base: "white", _dark: "gray.900" },
  },

  avatarCircle: {
    size: "120px",
    bg: "teal.50",
    color: "teal.600",
    border: "4px solid",
    borderColor: "teal.500",
  },

  infoIconCircle: (color: string) => ({
    size: "32px",
    bg: { base: `${color}.50`, _dark: `${color}.950` },
    color: `${color}.500`,
  }),

  inputField: {
    bg: { base: "gray.50", _dark: "gray.800" },
    color: { base: "black", _dark: "white" },
    border: "none",
    _focus: { ring: 2, ringColor: "teal.500" },
    h: 12,
  },

  infoBox: {
    p: 6,
    bg: "teal.500/5",
    borderRadius: "2xl",
    border: "1px dashed",
    borderColor: "teal.500/30",
  },

  infoText: {
    fontSize: "xs",
    color: "teal.600",
    fontWeight: "bold",
    mb: 1,
  },

  cancelButton: {
    variant: "ghost" as const,
    px: 5,
    _hover: { bg: "gray.300/10", borderRadius: "10px", h: "12" },
  },

  saveButton: {
    colorPalette: "teal",
    px: 5,
    h: 12,
    borderRadius: "xl",
  },
};
