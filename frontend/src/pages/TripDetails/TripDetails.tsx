import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Input,
  Field,
  Card,
  HStack,
  Badge,
  SimpleGrid,
  IconButton,
  Flex,
  Spinner,
  Circle,
  Container,
  Stack,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Flag,
  Calendar,
  MapPin,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "@/api/axios";
import { TripMap } from "@/components/TripMap";
import { Statistics } from "@/components/Statistics";
import { ExpenseSection } from "@/components/ExpenseSection";
import { formatDate, getDistanceFromLine } from "@/utils/helpers";
import { tripDetailsStyles as styles } from "./TripDetails.styles";
import { ActivitySection } from "@/components/ActivitySection";
import type { AddressObject, Destination, Trip } from "@/types/types";

export const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDates, setEditDates] = useState({ start: "", end: "" });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(0);
  const [statsRefresh, setStatsRefresh] = useState(0);

  const [dateError, setDateError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    lat: 0,
    lng: 0,
  });

  const refreshStats = () => {
    setStatsRefresh((prev) => prev + 1);
  };

  const refreshData = useCallback(async () => {
    try {
      const [tRes, dRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/destinations/${id}`),
      ]);
      setTrip(tRes.data);
      setDestinations(dRes.data);
    } catch (err) {
      toast.error("Failed to load trip details!");
    }
  }, [id]);

  useEffect(() => {
    if (id) refreshData();
  }, [id, refreshData]);

  useEffect(() => {
    if (!formData.startDate || !formData.endDate) {
      setDateError(null);
      return;
    }
    const sDate = new Date(formData.startDate);
    const eDate = new Date(formData.endDate);

    if (sDate > eDate) {
      setDateError("Arrival date cannot be after departure!");
      return;
    }

    const overlap = destinations.find((d) => {
      const dStart = new Date(d.startDate);
      const dEnd = new Date(d.endDate);
      return sDate <= dEnd && eDate >= dStart;
    });

    if (overlap) setDateError(`Overlaps with: ${overlap.city}`);
    else setDateError(null);
  }, [formData.startDate, formData.endDate, destinations]);

  const handleLocationFromMap = (
    addrObj: AddressObject,
    lat: number,
    lng: number,
  ) => {
    if (!trip) return;

    const routePoints = [
      { lat: trip.startLat, lng: trip.startLng },
      ...destinations.map((d) => ({ lat: d.latitude, lng: d.longitude })),
      { lat: trip.endLat, lng: trip.endLng },
    ];

    let minDistanceToRoute = Infinity;

    for (let i = 0; i < routePoints.length - 1; i++) {
      const start = routePoints[i];
      const end = routePoints[i + 1];

      const d = getDistanceFromLine(
        lat,
        lng,
        start.lat,
        start.lng,
        end.lat,
        end.lng,
      );
      if (d < minDistanceToRoute) {
        minDistanceToRoute = d;
      }
    }

    if (minDistanceToRoute > 200) {
      toast.warn(
        `Location is too far from the planned route (${Math.round(minDistanceToRoute)}km)! Max allowed: 200km!`,
      );
      return;
    }

    const rawCity =
      addrObj.city || addrObj.town || addrObj.village || "Selected Location";
    const cleanCity = String(rawCity)
      .replace(/(Gradska opština|Grad|Opština)\s+/gi, "")
      .trim();

    const defaultDate = trip?.startDate ? trip.startDate.split("T")[0] : "";

    setFormData((prev) => ({
      ...prev,
      city: cleanCity,
      country: addrObj.country || "Unknown",
      lat,
      lng,
      startDate: defaultDate,
      endDate: defaultDate,
    }));
    toast.info(`Selected: ${cleanCity}`);
  };

  const handleAddDestination = async () => {
    if (!formData.city) {
      toast.error("Please select a location on the map first!");
      return;
    }
    if (dateError) return;

    setLoading(true);
    try {
      await api.post("/destinations", {
        tripId: id,
        ...formData,
        latitude: formData.lat,
        longitude: formData.lng,
      });
      toast.success(`Success! Added ${formData.city} to your trip.`);
      setFormData({
        city: "",
        country: "",
        startDate: "",
        endDate: "",
        lat: 0,
        lng: 0,
      });
      await refreshData();
    } catch (err) {
      toast.error("Failed to save destination!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    if (tempBudget < 0) {
      toast.error("Budget cannot be negative!");
      return;
    }
    try {
      await api.put(`/trips/${id}`, { totalBudget: Number(tempBudget) });
      setTrip((prev: Trip | null) => {
        if (!prev) return null;
        return {
          ...prev,
          totalBudget: Number(tempBudget),
        };
      });
      setIsEditingBudget(false);
      refreshData();
      refreshStats();
      toast.success("Budget updated successfully!");
    } catch (err) {
      toast.error("Error updating budget!");
    }
  };

  const handleUpdateDates = async (destId: string, isFinal: boolean) => {
    if (!trip) return;

    const sDate = new Date(editDates.start);

    const finalEndDate = isFinal ? trip.endDate.split("T")[0] : editDates.end;
    const eDate = new Date(finalEndDate);

    if (sDate > eDate) {
      return toast.error("Arrival cannot be after departure!");
    }

    const overlap = destinations.find((d) => {
      if (d._id === destId) return false;
      const dStart = new Date(d.startDate);
      const dEnd = new Date(d.endDate);
      return sDate <= dEnd && eDate >= dStart;
    });

    if (overlap) {
      return toast.error(`Overlaps with: ${overlap.city}`);
    }

    try {
      await api.put(`/destinations/${destId}`, {
        startDate: editDates.start,
        endDate: finalEndDate,
      });

      toast.success("Schedule updated!");
      setEditingId(null);
      await refreshData();
    } catch (err) {
      toast.error("Failed to update dates!");
    }
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/destinations/${deleteId}`);
      toast.success("Stop removed from itinerary!");
      setDeleteId(null);
      setIsDeleteOpen(false);
      refreshData();
      refreshStats();
    } catch (err) {
      toast.error("Failed to delete stop!");
    }
  };

  if (!trip)
    return (
      <Flex
        h="100vh"
        align="center"
        justify="center"
        bg={{ _dark: "gray.950" }}
      >
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );

  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh" pb={20}>
      <Box {...styles.glass} py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <HStack>
              <IconButton
                onClick={() => navigate("/trips")}
                variant="ghost"
                aria-label="Go back"
              >
                <ArrowLeft />
              </IconButton>
              <VStack align="start" gap={0}>
                <Heading size="md">{trip.title}</Heading>
                <HStack gap={3}>
                  <Text fontSize="xs" color="teal.500" fontWeight="bold">
                    {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                  </Text>
                  {isEditingBudget ? (
                    <HStack gap={1}>
                      <Input
                        size="xs"
                        w="80px"
                        type="number"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(Number(e.target.value))}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveBudget()
                        }
                        autoFocus
                      />
                      <IconButton
                        size="xs"
                        colorPalette="green"
                        onClick={handleSaveBudget}
                        aria-label="Save"
                      >
                        <CheckCircle2 size={12} />
                      </IconButton>
                    </HStack>
                  ) : (
                    <Badge
                      colorPalette="orange"
                      variant="subtle"
                      cursor="pointer"
                      onClick={() => {
                        setTempBudget(trip.totalBudget || 0);
                        setIsEditingBudget(true);
                      }}
                    >
                      Budget: {trip.totalBudget || 0} € ✏️
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </HStack>
            <Badge
              colorPalette="teal"
              variant="surface"
              size="lg"
              borderRadius="full"
              px={4}
              display={{ base: "none", md: "inline-flex" }}
            >
              {trip.startCity} ➔ {trip.endCity}
            </Badge>
          </Flex>
        </Container>
      </Box>

      <Box
        w="full"
        h="400px"
        bg="gray.200"
        borderBottom="4px solid"
        borderColor="teal.500"
      >
        <TripMap
          key={destinations.length}
          startPos={{
            lat: trip.startLat,
            lng: trip.startLng,
            city: trip.startCity,
          }}
          endPos={{ lat: trip.endLat, lng: trip.endLng, city: trip.endCity }}
          destinations={destinations}
          onLocationSelect={handleLocationFromMap}
        />
      </Box>

      <Container maxW="container.xl" mt={8}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={12}>
          <Statistics tripId={id!} refreshTrigger={statsRefresh} />

          <Card.Root
            {...styles.card}
            border="2px solid"
            borderColor={dateError ? "red.400" : "teal.500"}
          >
            <VStack align="stretch" gap={4}>
              <Heading size="xs" color="gray.400">
                PLAN NEW STOP
              </Heading>
              <Box
                p={3}
                bg="teal.50/10"
                borderRadius="xl"
                border="1px dashed"
                borderColor="teal.500"
              >
                <HStack>
                  <MapPin size={16} color="teal" />
                  <Text fontWeight="bold">
                    {formData.city || "Search on the map to select..."}
                  </Text>
                </HStack>
              </Box>

              {formData.city && (
                <>
                  <SimpleGrid columns={2} gap={4}>
                    <Field.Root invalid={!!dateError}>
                      <Field.Label fontSize="xs">ARRIVAL</Field.Label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root invalid={!!dateError}>
                      <Field.Label fontSize="xs">DEPARTURE</Field.Label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </Field.Root>
                  </SimpleGrid>
                  {dateError && (
                    <HStack color="red.400">
                      <AlertTriangle size={14} />
                      <Text fontSize="xs" fontWeight="bold">
                        {dateError}
                      </Text>
                    </HStack>
                  )}
                  <Button
                    colorPalette="teal"
                    size="lg"
                    borderRadius="xl"
                    loading={loading}
                    disabled={!!dateError || !formData.startDate}
                    onClick={handleAddDestination}
                  >
                    CONFIRM STOP{" "}
                    <CheckCircle2 size={18} style={{ marginLeft: "8px" }} />
                  </Button>
                </>
              )}
            </VStack>
          </Card.Root>
        </SimpleGrid>

        <VStack gap={10} align="stretch">
          {destinations.map((dest, idx) => {
            const isLast = dest.isFinal;

            return (
              <Card.Root
                key={dest._id}
                borderRadius="3xl"
                shadow="lg"
                overflow="hidden"
                border="none"
              >
                <Box
                  p={5}
                  bg={isLast ? "teal.600" : "gray.800"}
                  color="white"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <HStack gap={4}>
                    <Circle
                      bg="white"
                      color={isLast ? "teal.600" : "gray.800"}
                      size="45px"
                      fontWeight="black"
                      fontSize="lg"
                    >
                      {isLast ? (
                        <Flag size={22} fill="currentColor" />
                      ) : (
                        idx + 1
                      )}
                    </Circle>

                    <VStack align="start" gap={0}>
                      <HStack>
                        <Text
                          fontWeight="bold"
                          fontSize="xl"
                          letterSpacing="tight"
                        >
                          {dest.city.toUpperCase()}
                        </Text>
                        {isLast && (
                          <Badge
                            bg="white"
                            color="teal.600"
                            borderRadius="full"
                            px={3}
                            fontWeight="bold"
                          >
                            FINAL DESTINATION
                          </Badge>
                        )}
                      </HStack>

                      {editingId === dest._id ? (
                        <Stack
                          direction={{ base: "column", sm: "row" }}
                          gap={3}
                          bg="blackAlpha.300"
                          p={3}
                          borderRadius="2xl"
                          mt={2}
                          align="stretch"
                        >
                          <VStack align="start" gap={0}>
                            <Text fontSize="9px" fontWeight="bold" ml={1}>
                              ARRIVAL
                            </Text>
                            <Input
                              size="xs"
                              type="date"
                              p={1}
                              value={editDates.start}
                              onChange={(e) =>
                                setEditDates({
                                  ...editDates,
                                  start: e.target.value,
                                })
                              }
                              color="white"
                              colorScheme="dark"
                              border="1px solid white"
                            />
                          </VStack>

                          {!isLast && (
                            <>
                              <Box
                                w={{ base: "0px", md: "1px" }}
                                h={{ base: "0px", md: "40px" }}
                                bg="whiteAlpha.400"
                              />
                              <VStack align="start" gap={0}>
                                <Text fontSize="9px" fontWeight="bold" ml={1}>
                                  DEPARTURE
                                </Text>
                                <Input
                                  size="xs"
                                  type="date"
                                  p={1}
                                  value={editDates.end}
                                  onChange={(e) =>
                                    setEditDates({
                                      ...editDates,
                                      end: e.target.value,
                                    })
                                  }
                                  color="white"
                                  colorScheme="dark"
                                  border="1px solid white"
                                />
                              </VStack>
                            </>
                          )}

                          <HStack
                            gap={1}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <IconButton
                              size="sm"
                              colorPalette="green"
                              borderRadius="full"
                              onClick={() =>
                                handleUpdateDates(dest._id, dest.isFinal)
                              }
                            >
                              <CheckCircle2 size={16} />
                            </IconButton>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              color="white"
                              onClick={() => setEditingId(null)}
                            >
                              <X size={16} />
                            </IconButton>
                          </HStack>
                        </Stack>
                      ) : (
                        <HStack
                          mt={1}
                          cursor="pointer"
                          _hover={{ opacity: 0.8 }}
                          onClick={() => {
                            setEditingId(dest._id);
                            setEditDates({
                              start: dest.startDate.split("T")[0],
                              end: dest.endDate.split("T")[0],
                            });
                          }}
                          flexWrap="wrap"
                          columnGap={2}
                          rowGap={1}
                          alignItems="center"
                        >
                          <Calendar size={14} />
                          <Text fontWeight="semibold" fontSize="md">
                            {formatDate(dest.startDate)} —{" "}
                            {formatDate(isLast ? trip.endDate : dest.endDate)}
                          </Text>
                          <Text fontSize="xs" opacity={0.6}>
                            ✏️ click for edit
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </HStack>

                  {!isLast && (
                    <IconButton
                      variant="subtle"
                      colorPalette="red"
                      borderRadius="full"
                      onClick={() => {
                        setDeleteId(dest._id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  )}
                </Box>

                <Card.Body p={6} bg={{ _dark: "gray.900" }}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={12}>
                    <ActivitySection
                      destination={dest}
                      onUpdate={refreshStats}
                    />
                    <ExpenseSection
                      destination={dest}
                      onUpdate={refreshStats}
                    />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>
            );
          })}
        </VStack>
      </Container>

      {isDeleteOpen && (
        <Box {...styles.deleteModal}>
          <Card.Root maxW="400px" p={6} borderRadius="3xl">
            <VStack gap={4}>
              <Circle size="60px" bg="red.500/10" color="red.500">
                <Trash2 size={30} />
              </Circle>
              <Heading size="md">Delete this stop?</Heading>
              <Text textAlign="center" fontSize="sm" color="gray.500">
                This will permanently remove all activities and expenses
                associated with this location.
              </Text>
              <HStack w="full" gap={4} mt={2}>
                <Button
                  flex={1}
                  variant="ghost"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button flex={1} colorPalette="red" onClick={confirmDelete}>
                  Yes, Delete
                </Button>
              </HStack>
            </VStack>
          </Card.Root>
        </Box>
      )}
    </Box>
  );
};
