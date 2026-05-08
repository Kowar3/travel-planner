import {
  Box,
  Heading,
  Button,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Plus, Globe, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { tripStyles as styles } from "./Trips.styles";
import { TripCard } from "@/components/TripCard";
import { EmptyState } from "@/components/EmptyState";
import { useTrips } from "@/hooks/useTrips";
import { TripCardSkeleton } from "@/components/TripCardSkeleton";

interface QueryParams {
  page: number;
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
  order: "asc" | "desc";
  [key: string]: any;
}

export const Trips = () => {
  const navigate = useNavigate();

  const { trips, loading, totalPages, params, setParams, reload } = useTrips({
    searchTerm: "",
    statusFilter: "all",
    sortBy: "startDate",
    order: "asc",
    page: 1,
  });

  const updateParam = (k: keyof QueryParams | string, v: any) => {
    setParams((p: any) => ({
      ...p,
      [k]: v,
      page: k === "page" ? Number(v) : 1,
    }));
  };

  const isFiltering = params.searchTerm !== "" || params.statusFilter !== "all";

  return (
    <Box {...styles.container}>
      <Stack {...styles.headerStack}>
        <VStack align="start" gap={1}>
          <HStack>
            <Globe size={18} color="teal" />
            <Text {...styles.badgeText}>MY JOURNEYS</Text>
          </HStack>
          <Heading size="3xl" fontWeight="black">
            Your Adventures
          </Heading>
        </VStack>
        <Button
          mt={30}
          {...styles.addButton}
          onClick={() => navigate("/trips/new")}
        >
          <Plus size={20} /> Add New Trip
        </Button>
      </Stack>

      <Stack {...styles.toolbar}>
        <HStack {...styles.searchBox}>
          <Search size={18} color="#A0AEC0" />
          <Input
            placeholder="Search trip..."
            value={params.searchTerm}
            onChange={(e) => updateParam("searchTerm", e.target.value)}
          />
        </HStack>

        <HStack gap={3}>
          <select
            style={styles.select}
            value={params.statusFilter}
            onChange={(e) => updateParam("statusFilter", e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active Now</option>
            <option value="past">Completed</option>
          </select>

          <select
            style={styles.select}
            value={`${params.sortBy}-${params.order}`}
            onChange={(e) => {
              const [f, d] = e.target.value.split("-");
              setParams((p: any) => ({
                ...p,
                sortBy: f,
                order: d as "asc" | "desc",
                page: 1,
              }));
            }}
          >
            <option value="startDate-asc">Date (Soonest)</option>
            <option value="startDate-desc">Date (Newest)</option>
            <option value="totalBudget-desc">Highest Budget</option>
            <option value="totalBudget-asc">Lowest Budget</option>
          </select>
        </HStack>
      </Stack>

      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </SimpleGrid>
      ) : trips.length > 0 ? (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
            {trips.map((t) => (
              <TripCard
                key={t._id}
                trip={t}
                onClick={() => navigate(`/trips/${t._id}`)}
                onDeleted={reload}
              />
            ))}
          </SimpleGrid>

          <HStack {...styles.pagination}>
            <Button
              variant="outline"
              disabled={params.page === 1}
              onClick={() => updateParam("page", params.page - 1)}
            >
              <ChevronLeft size={18} /> Prev
            </Button>
            <Text fontWeight="bold">
              Page {params.page} of {totalPages}
            </Text>
            <Button
              variant="outline"
              disabled={params.page === totalPages}
              onClick={() => updateParam("page", params.page + 1)}
            >
              Next <ChevronRight size={18} />
            </Button>
          </HStack>
        </>
      ) : (
        <EmptyState
          isSearch={isFiltering}
          onAction={() => {
            if (isFiltering) {
              setParams({
                searchTerm: "",
                statusFilter: "all",
                sortBy: "startDate",
                order: "asc",
                page: 1,
              });
            } else {
              navigate("/trips/new");
            }
          }}
        />
      )}
    </Box>
  );
};
