import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Field,
  Text,
  Card,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Wallet } from "lucide-react";

import { createTripStyles as styles } from "./CreateTrip.styles";
import { useCreateTrip } from "@/hooks/useCreateTrip";
import { TripMap } from "@/components/TripMap";

export const CreateTrip = () => {
  const {
    formData,
    setFormData,
    loading,
    selecting,
    setSelecting,
    handleMapSelect,
    handleCreateTrip,
  } = useCreateTrip();

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box {...styles.container}>
      <Stack direction={{ base: "column", lg: "row" }} gap={10} align="stretch">
        <VStack w={{ base: "full", lg: "450px" }} align="stretch" gap={6}>
          <Heading size="2xl" fontWeight="black" color="teal.500">
            Trip plan
          </Heading>

          <Card.Root {...styles.card}>
            <Card.Body gap={5}>
              <Field.Root>
                <Field.Label fontWeight="bold" fontSize="xs" color="gray.400">
                  TRIP TITLE
                </Field.Label>
                <Input
                  {...styles.input}
                  placeholder="e. g. Kragujevac - Beč"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Field.Root>

              <SimpleGrid columns={2} gap={4}>
                <Box
                  {...styles.locationBox(selecting === "start", "start")}
                  onClick={() => setSelecting("start")}
                >
                  <Text fontSize="10px" fontWeight="black" color="green.500">
                    FROM (GREEN)
                  </Text>
                  <Text {...styles.chooseText}>
                    {formData.startCity || "Choose..."}
                  </Text>
                </Box>

                <Box
                  {...styles.locationBox(selecting === "end", "end")}
                  onClick={() => setSelecting("end")}
                >
                  <Text fontSize="10px" fontWeight="black" color="red.500">
                    TO (RED)
                  </Text>
                  <Text {...styles.chooseText}>
                    {formData.endCity || "Choose..."}
                  </Text>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Field.Root>
                  <Field.Label fontWeight="bold" fontSize="xs" color="gray.400">
                    DEPARTURE
                  </Field.Label>
                  <Input
                    type="date"
                    {...styles.input}
                    min={today}
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontWeight="bold" fontSize="xs" color="gray.400">
                    RETURN
                  </Field.Label>
                  <Input
                    type="date"
                    {...styles.input}
                    min={formData.startDate || today}
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </Field.Root>
              </SimpleGrid>

              <Field.Root>
                <Field.Label fontWeight="bold" fontSize="xs" color="gray.400">
                  PLANNED BUDGET (€)
                </Field.Label>
                <Box {...styles.inputGroup}>
                  <Input
                    type="number"
                    {...styles.input}
                    placeholder="Min 1 €"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  />

                  <Box {...styles.inputIcon}>
                    <Wallet size={22} />
                  </Box>
                </Box>
              </Field.Root>

              <Button
                {...styles.addButton}
                loading={loading}
                onClick={handleCreateTrip}
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
              >
                ADD TRIP
              </Button>
            </Card.Body>
          </Card.Root>
        </VStack>

        <Box {...styles.mapWrapper}>
          <TripMap
            onLocationSelect={handleMapSelect}
            startPos={{ lat: formData.startLat, lng: formData.startLng }}
            endPos={{ lat: formData.endLat, lng: formData.endLng }}
          />
        </Box>
      </Stack>
    </Box>
  );
};
