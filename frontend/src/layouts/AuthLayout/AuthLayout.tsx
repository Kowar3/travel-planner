import { Flex, Box, Text, VStack, Circle } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { s as styles } from "./AuthLayout.styles";
import { ColorModeToggle } from "@/components/ColorModeToggle";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex {...styles.container}>
      <Box {...styles.themeTogglePos}>
        <ColorModeToggle />
      </Box>
      <Circle {...styles.circleTop} />
      <Circle {...styles.circleBottom} />
      <VStack gap={8} zIndex={1} w="full">
        <VStack gap={0}>
          <Text {...styles.logoText}>TravelPlanner</Text>
          <Box {...styles.lineUnderHeading} />
        </VStack>
        <Box w="full" maxW="460px">
          {children}
        </Box>
      </VStack>
    </Flex>
  );
};
