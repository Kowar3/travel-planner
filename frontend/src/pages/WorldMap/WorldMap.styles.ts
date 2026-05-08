import type { BoxProps, GridProps } from "@chakra-ui/react";

export const worldmapStyles = {
  container: {
    gap: 8,
    flexDirection: "column",
  },

  statsGrid: {
    templateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
    gap: 6,
    mb: 8,
  } as GridProps,

  mapWrapper: {
    h: "65vh",
    borderRadius: "3xl",
    overflow: "hidden",
    shadow: "xl",
    border: "1px solid",
    borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
  } as BoxProps,

  popupTitle: {
    fontWeight: "bold",
    color: "teal.600",
  },

  popupLocation: {
    fontSize: "xs",
    fontWeight: "bold",
  },

  popupBudget: {
    fontSize: "xs",
    color: "gray.500",
  },

  loadingCenter: {
    h: "500px",
  } as BoxProps,
};
