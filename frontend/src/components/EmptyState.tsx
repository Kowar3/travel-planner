import { Card, VStack, Heading, Text, Button, Box } from "@chakra-ui/react";
import { SearchX, Plus } from "lucide-react";

interface EmptyStateProps {
  onAction: VoidFunction;
  isSearch?: boolean;
}

export const EmptyState = ({ onAction, isSearch = false }: EmptyStateProps) => {
  if (isSearch) {
    return (
      <VStack
        py={20}
        bg={{ base: "gray.50", _dark: "whiteAlpha.50" }}
        borderRadius="3xl"
        border="2px dashed"
        borderColor="gray.200"
        w="full"
        gap={4}
      >
        <Box color="gray.400">
          <SearchX size={48} strokeWidth={1.5} />
        </Box>
        <VStack gap={1}>
          <Text
            fontWeight="bold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            No results found
          </Text>
          <Text color="gray.500" fontSize="sm">
            Try adjusting your search or filters to find what you're looking
            for.
          </Text>
        </VStack>
        <Button
          variant="outline"
          colorPalette="teal"
          borderRadius="xl"
          onClick={onAction}
          mt={2}
        >
          Reset all filters
        </Button>
      </VStack>
    );
  }

  return (
    <Card.Root
      borderRadius="3xl"
      bgGradient="to-br"
      gradientFrom="teal.600"
      gradientTo="teal.800"
      p={{ base: 8, md: 16 }}
      textAlign="center"
      color="white"
      border="none"
      shadow="2xl"
      w="full"
    >
      <VStack gap={6}>
        <Heading size="2xl" letterSpacing="tight">
          You still don't have any trips? 🌍
        </Heading>

        <Text fontSize="lg" opacity={0.9} maxW="md">
          Your dashboard is waiting for your first adventure. Create a plan,
          pack your bags and go!
        </Text>

        <Button
          bg="white"
          color="teal.700"
          size="xl"
          px={12}
          borderRadius="full"
          fontWeight="bold"
          onClick={onAction}
          _hover={{
            bg: "teal.50",
            transform: "scale(1.05)",
          }}
          _active={{ transform: "scale(0.95)" }}
          transition="all 0.2s"
        >
          <Plus size={20} style={{ marginRight: "8px" }} />
          Create your first trip
        </Button>
      </VStack>
    </Card.Root>
  );
};
