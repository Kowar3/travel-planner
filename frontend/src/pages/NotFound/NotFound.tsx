import { Box, Heading, Text, Button, VStack, Circle } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Home, MapPinOff } from "lucide-react";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={{ base: "gray.50", _dark: "gray.950" }}
    >
      <VStack gap={6} textAlign="center" p={8}>
        <Circle
          size="120px"
          bg="teal.500/10"
          color="teal.500"
          mb={2}
          animation="pulse 2s infinite"
        >
          <MapPinOff size={60} />
        </Circle>

        <VStack gap={2}>
          <Heading size="4xl" fontWeight="black" color="teal.500">
            404
          </Heading>
          <Heading size="xl">You look a bit lost...</Heading>
          <Text color="gray.500" maxW="md">
            The destination you are looking for doesn't exist or has been moved
            to another coordinate.
          </Text>
        </VStack>

        <Button
          size="lg"
          colorPalette="teal"
          borderRadius="full"
          px={8}
          gap={2}
          onClick={() => navigate("/")}
          _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
          transition="all 0.2s"
        >
          <Home size={18} />
          Back to Safety
        </Button>
      </VStack>
    </Box>
  );
};
