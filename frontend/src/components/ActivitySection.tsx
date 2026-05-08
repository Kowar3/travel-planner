import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Input,
  Button,
  Badge,
  Card,
  HStack,
  IconButton,
  Circle,
  Center,
} from "@chakra-ui/react";
import {
  MapPin,
  Calendar,
  ClipboardList,
  Plus,
  Trash2,
  TentTree,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/axios";
import type { Activity, Destination } from "@/types/types";

export const ActivitySection = ({
  destination,
  onUpdate,
}: {
  destination: Destination;
  onUpdate?: () => void;
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = destination?.startDate
    ? destination.startDate.split("T")[0]
    : "";
  const maxDate = destination?.endDate ? destination.endDate.split("T")[0] : "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: minDate,
  });

  useEffect(() => {
    if (destination?._id) {
      loadActivities();
      setFormData((prev) => ({ ...prev, date: minDate }));
    }
  }, [destination?._id, minDate]);

  const loadActivities = async () => {
    try {
      const res = await api.get(`/activities/${destination._id}`);
      setActivities(res.data);
    } catch (err) {
      toast.error("Failed to load activities!");
    }
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      toast.warn("Activity title is required!");
      return;
    }
    if (!formData.date) {
      toast.warn("Please select a date!");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/activities", {
        destinationId: destination._id,
        ...formData,
      });

      toast.success("Activity added!");
      setFormData({ title: "", description: "", location: "", date: minDate });
      loadActivities();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Could not save activity!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/activities/${id}`);
      toast.info("Activity removed!");
      loadActivities();
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to delete activity!");
    }
  };

  return (
    <Box height="480px" display="flex" flexDirection="column">
      <HStack mb={3} color="teal.500">
        <ClipboardList size={16} />
        <Heading
          size="xs"
          textTransform="uppercase"
          letterSpacing="widest"
          color={{ _dark: "teal.300" }}
        >
          Daily Activities
        </Heading>
      </HStack>

      <Box
        flex="1"
        overflowY="auto"
        pr={2}
        mb={3}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: { base: "teal.100", _dark: "whiteAlpha.300" },
            borderRadius: "10px",
          },
        }}
      >
        <VStack gap={3} align="stretch">
          {activities.length > 0 ? (
            activities.map((act) => (
              <Box
                key={act._id}
                p={3}
                bg={{ base: "white", _dark: "whiteAlpha.100" }}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }}
                transition="all 0.2s"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1} flex="1">
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={{ _dark: "whiteAlpha.900" }}
                      >
                        {act.title}
                      </Text>
                      {act.description && (
                        <Text fontSize="xs" color="gray.500">
                          {act.description}
                        </Text>
                      )}
                    </Box>
                    <HStack gap={2} wrap="wrap">
                      <Badge
                        size="sm"
                        colorPalette="teal"
                        variant="subtle"
                        borderRadius="full"
                      >
                        <HStack gap={1}>
                          <Calendar size={10} />
                          <Text fontSize="10px">
                            {new Date(act.date).toLocaleDateString("en-US")}
                          </Text>
                        </HStack>
                      </Badge>
                      {act.location && (
                        <Badge
                          size="sm"
                          colorPalette="gray"
                          variant="subtle"
                          borderRadius="full"
                        >
                          <HStack gap={1}>
                            <MapPin size={10} />
                            <Text fontSize="10px">{act.location}</Text>
                          </HStack>
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                  <IconButton
                    aria-label="Delete"
                    variant="ghost"
                    colorPalette="red"
                    size="xs"
                    onClick={() => handleDelete(act._id)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </HStack>
              </Box>
            ))
          ) : (
            <Center
              flex="1"
              h="180px"
              bg={{ base: "teal.50/30", _dark: "whiteAlpha.50" }}
              borderRadius="3xl"
              border="2px dashed"
              borderColor={{ base: "teal.100", _dark: "whiteAlpha.200" }}
              p={6}
            >
              <VStack gap={3} textAlign="center">
                <Circle
                  size="48px"
                  bg={{ base: "white", _dark: "gray.800" }}
                  shadow="xl"
                  color="teal.400"
                >
                  <TentTree size={24} />
                </Circle>
                <VStack gap={1}>
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    color={{ _dark: "whiteAlpha.900" }}
                  >
                    No plans yet?
                  </Text>
                  <Text fontSize="xs" color="gray.500" maxW="180px">
                    Add your first adventure for this stop using the form below.
                  </Text>
                </VStack>
              </VStack>
            </Center>
          )}
        </VStack>
      </Box>

      <Card.Root
        variant="subtle"
        p={3}
        borderRadius="3xl"
        bg={{ base: "teal.50/50", _dark: "whiteAlpha.100" }}
        border="1px solid"
        borderColor={{ base: "teal.100", _dark: "whiteAlpha.200" }}
      >
        <VStack gap={2}>
          <Box w="full">
            <Input
              size="sm"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              placeholder="Activity name..."
              value={formData.title}
              border="none"
              _focus={{ ring: "2px", ringColor: "teal.400" }}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Box>

          <Box w="full">
            <Input
              size="sm"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              placeholder="Description (optional)..."
              value={formData.description}
              border="none"
              _focus={{ ring: "2px", ringColor: "teal.400" }}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Box>

          <HStack w="full" gap={2}>
            <Input
              size="sm"
              type="date"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              min={minDate}
              max={maxDate}
              value={formData.date}
              border="none"
              flex="1"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <Input
              size="sm"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              placeholder="Where?"
              value={formData.location}
              border="none"
              flex="1"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </HStack>

          <Button
            w="full"
            size="sm"
            borderRadius="xl"
            colorPalette="teal"
            onClick={handleAdd}
            loading={isSubmitting}
            shadow="lg"
          >
            <Plus size={16} /> Add Activity
          </Button>
        </VStack>
      </Card.Root>
    </Box>
  );
};
