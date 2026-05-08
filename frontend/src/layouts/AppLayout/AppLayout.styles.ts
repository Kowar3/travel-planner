export const appLayoutstyles = {
  menuItem: (isActive: boolean, isCollapsed: boolean) => ({
    w: "full",
    px: 4,
    py: 3,
    borderRadius: "xl",
    bg: isActive ? "teal.600" : "transparent",
    color: isActive ? "white" : "gray.400",
    transition: "all 0.2s",
    gap: 4,
    justify: { base: "flex-start", sm: isCollapsed ? "center" : "flex-start" },
    _hover: {
      bg: isActive ? "teal.600" : "whiteAlpha.100",
      color: "white",
    },
  }),

  mainWrapper: {
    minH: "100vh",
    bg: { base: "gray.50", _dark: "black" },
    transition: "background 0.3s",
  },

  sidebar: (isCollapsed: boolean) => ({
    display: { base: "none", sm: "flex" },
    w: isCollapsed ? "85px" : "260px",
    h: "100vh",
    bg: "gray.950",
    p: isCollapsed ? 4 : 6,
    position: "sticky",
    top: 0,
    flexDirection: "column",
    transition: "width 0.3s ease",
    zIndex: 10,
    borderRight: "1px solid",
    borderColor: "whiteAlpha.100",
  }),

  sidebarHeading: {
    color: "white",
    fontWeight: "900",
    letterSpacing: "tight",
    fontSize: "20px",
  },

  collapseButton: {
    variant: "ghost" as const,
    color: "gray.400",
    _hover: {
      bg: "whiteAlpha.200",
    },
  },

  addBtn: (isCollapsed: boolean) => ({
    colorPalette: "teal",
    variant: "solid" as const,
    width: "full",
    height: isCollapsed ? "50px" : "12",
    borderRadius: isCollapsed ? "full" : "xl",
  }),

  logoutButton: (isCollapsed: boolean) => ({
    variant: "ghost" as const,
    colorPalette: "red",
    w: "full",
    justifyContent: isCollapsed ? "center" : "start",
  }),

  mobileMain: {
    position: "fixed",
    top: 0,
    left: 0,
    w: "100vw",
    h: "100vh",
    bg: "gray.950",
    zIndex: 9999,
    p: 8,
    display: { base: "flex", sm: "none" },
    flexDirection: "column",
  },

  addBtnMobile: {
    colorPalette: "teal",
    variant: "solid" as const,
    width: "full",
    height: "14",
    borderRadius: "2xl",
    shadow: "lg",
  },

  logoutBtnMobile: {
    size: "xl" as const,
    colorPalette: "red",
    variant: "subtle" as const,
    borderRadius: "2xl",
    h: "14",
  },

  outNavbar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minH: "100vh",
  },

  topNavbar: {
    h: "80px",
    bg: { base: "white/80", _dark: "gray.900/80" },
    backdropFilter: "blur(12px)",
    px: { base: 4, md: 10 },
    align: "center",
    justify: "space-between",
    borderBottom: "1px solid",
    borderColor: { base: "gray.100", _dark: "gray.800" },
    position: "sticky",
    top: 0,
    zIndex: 2000,
  },

  pageTitle: {
    fontWeight: "900",
    fontSize: { base: "md", sm: "xl", md: "2xl" },
    color: { base: "gray.800", _dark: "white" },
    whiteSpace: "nowrap",
  },

  userBadge: {
    bg: "teal.600",
    color: "white",
    px: 5,
    py: 2.5,
    borderRadius: "xl",
    shadow: "md",
    display: { base: "none", lg: "block" },
  },

  userMobile: {
    display: { base: "flex", lg: "none" },
    variant: "subtle" as const,
    borderRadius: "full",
    colorPalette: "teal",
  },
};
