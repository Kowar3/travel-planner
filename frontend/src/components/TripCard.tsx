import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Card,
  Badge,
  Separator,
  IconButton,
  Button,
  Circle,
} from "@chakra-ui/react";
import { ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
import api from "@/api/axios";
import { toast } from "react-toastify";
import type { Trip } from "@/types/types";

interface TripCardProps {
  trip: Trip;
  onClick: VoidFunction;
  onDeleted: () => VoidFunction;
}

export const TripCard = ({ trip, onClick, onDeleted }: TripCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate || trip.startDate);
  const diffDays =
    Math.ceil(
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  let statusText = "Upcoming";
  let headerBg = "teal.600";
  if (end < today) {
    statusText = "Completed";
    headerBg = "gray.500";
  } else if (start <= today && end >= today) {
    statusText = "Active Now";
    headerBg = "blue.600";
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/trips/${trip._id}`);
      toast.success("Trip deleted!");
      setIsDeleteOpen(false);
      onDeleted();
    } catch {
      toast.error("Failed to delete trip!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card.Root
        onClick={onClick}
        borderRadius="3xl"
        overflow="hidden"
        bg={{ base: "white", _dark: "gray.900" }}
        _hover={{ transform: "translateY(-8px)", boxShadow: "2xl" }}
        transition="all 0.3s"
        cursor="pointer"
        border="none"
        shadow="md"
      >
        <Box h="120px" bg={headerBg} p={6} position="relative">
          <HStack position="absolute" top={4} right={4}>
            <Badge bg="whiteAlpha.300" color="white" borderRadius="lg">
              {diffDays} DAYS
            </Badge>
            <Badge
              bg="white"
              color={headerBg}
              borderRadius="full"
              fontSize="2xs"
            >
              {statusText}
            </Badge>
            <IconButton
              aria-label="Delete trip"
              size="xs"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
              }}
            >
              <Trash2 size={14} />
            </IconButton>
          </HStack>
          <VStack align="start" gap={0} mt={4}>
            <Heading size="md" color="white" lineClamp={1}>
              {trip.title}
            </Heading>
            <HStack color="whiteAlpha.800" fontSize="xs" fontWeight="bold">
              <Text>{trip.startCity}</Text>
              <ArrowRight size={12} />
              <Text>{trip.endCity}</Text>
            </HStack>
          </VStack>
        </Box>
        <Card.Body p={6}>
          <VStack align="stretch" gap={4}>
            <Text color="gray.500" fontSize="sm" lineClamp={2} minH="40px">
              {trip.description}
            </Text>
            <Separator opacity={0.2} />
            <HStack justify="space-between">
              <VStack align="start" gap={0}>
                <Text fontSize="2xs" fontWeight="black" color="gray.400">
                  DATES
                </Text>
                <Text fontSize="xs" fontWeight="bold">
                  {new Date(trip.startDate).toLocaleDateString("sr-RS")} -{" "}
                  {new Date(trip.endDate).toLocaleDateString("sr-RS")}
                </Text>
              </VStack>
              <VStack align="end" gap={0}>
                <Text fontSize="2xs" fontWeight="black" color="gray.400">
                  BUDGET
                </Text>
                <Text fontSize="md" fontWeight="black" color="teal.500">
                  €{trip.totalBudget?.toLocaleString()}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {isDeleteOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteOpen(false);
          }}
        >
          <Card.Root
            maxW="400px"
            w="90%"
            p={6}
            borderRadius="3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack gap={4}>
              <Circle size="60px" bg="red.500/10" color="red.500">
                <Trash2 size={30} />
              </Circle>
              <Heading size="md">Delete this trip?</Heading>
              <Text textAlign="center" fontSize="sm" color="gray.500">
                This will permanently remove{" "}
                <Text as="span" fontWeight="bold" color="gray.700">
                  {trip.title}
                </Text>{" "}
                along with all its destinations, activities and expenses.
              </Text>
              <HStack w="full" gap={4} mt={2}>
                <Button
                  flex={1}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  flex={1}
                  colorPalette="red"
                  loading={deleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  Yes, Delete
                </Button>
              </HStack>
            </VStack>
          </Card.Root>
        </Box>
      )}
    </>
  );
};
