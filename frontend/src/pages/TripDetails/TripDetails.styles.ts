export const tripDetailsStyles = {
  glass: {
    bg: { base: "white", _dark: "gray.900" },
    borderBottom: "1px solid",
    borderColor: { _dark: "whiteAlpha.100" },
  },

  deleteModal: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    w: "100vw",
    h: "100vh",
    bg: "blackAlpha.800",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
  },

  card: {
    p: 6,
    borderRadius: "3xl",
    shadow: "xl",
  },

  editDates: {
    fontSize: "xs",
    opacity: 0.8,
    cursor: "pointer",
  },

  iconButtonConfirm: {
    size: "xs" as const,
    colorPalette: "green",
    ariaLabel: "Confirm",
  },

  iconButtonCancel: {
    size: "xs" as const,
    variant: "ghost" as const,
    ariaLabel: "Cancel",
  },

  iconButtonDelete: {
    colorPalette: "red",
    variant: "ghost" as const,
    ariaLabel: "Delete stop",
  },
};
