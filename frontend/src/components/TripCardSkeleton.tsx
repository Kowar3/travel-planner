import {
  Box,
  Card,
  Skeleton,
  SkeletonText,
  VStack,
  HStack,
  Separator,
} from "@chakra-ui/react";

export const TripCardSkeleton = () => {
  return (
    <Card.Root
      borderRadius="3xl"
      overflow="hidden"
      border="none"
      shadow="md"
      w="full"
    >
      <Box h="120px" bg="gray.100" _dark={{ bg: "gray.800" }} p={6}>
        <HStack justify="space-between" mb={4}>
          <Skeleton h="20px" w="60px" borderRadius="lg" />
          <Skeleton h="20px" w="80px" borderRadius="full" />
        </HStack>
        <VStack align="start" gap={2}>
          <Skeleton h="24px" w="70%" />
          <Skeleton h="14px" w="40%" />
        </VStack>
      </Box>

      <Card.Body p={6}>
        <VStack align="stretch" gap={4}>
          <SkeletonText noOfLines={2} gap={2} />

          <Separator opacity={0.2} />

          <HStack justify="space-between">
            <VStack align="start" gap={2}>
              <Skeleton h="10px" w="40px" />
              <Skeleton h="16px" w="100px" />
            </VStack>
            <VStack align="end" gap={2}>
              <Skeleton h="10px" w="40px" />
              <Skeleton h="20px" w="60px" />
            </VStack>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
