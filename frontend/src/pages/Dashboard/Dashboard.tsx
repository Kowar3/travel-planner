import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Card,
  HStack,
  Circle,
  Badge,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Wallet, Car, Calendar, ArrowRight, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { dashboardStyles as styles } from "./Dashboard.styles";
import { formatDate } from "@/utils/helpers";
import { StatCard } from "@/components/StatCard";

import { EmptyState } from "@/components/EmptyState";
import axios from "axios";
import type { Trip } from "@/types/types";

interface ChartDataItem {
  name: string;
  budget: number;
  fill: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: -1,
    totalDays: 0,
    totalPlanned: 0,
    totalSpent: 0,
  });
  const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, upcomingRes] = await Promise.all([
          api.get("/statistics/global-stats", { signal: controller.signal }),
          api.get("/trips?status=upcoming&limit=1&sortBy=startDate&order=asc", {
            signal: controller.signal,
          }),
        ]);

        const sData = statsRes.data;

        setStats({
          totalTrips: sData.totalTrips,
          totalDays: sData.totalDays,
          totalSpent: sData.totalSpent || 0,
          totalPlanned: sData.totalPlanned,
        });

        setUpcomingTrip(upcomingRes.data.trips?.[0] || null);

        const vibrantColors = [
          "#319795",
          "#3182ce",
          "#805ad5",
          "#dd6b20",
          "#d53f8c",
        ];
        const formatted = (sData.lastFiveTrips || [])
          .map((t: any, i: number) => ({
            name:
              t.title.length > 10 ? t.title.substring(0, 8) + ".." : t.title,
            budget: Number(t.totalBudget) || 0,
            fill: vibrantColors[i % vibrantColors.length],
          }))
          .reverse();
        setChartData(formatted);
      } catch (error: unknown) {
        if (axios.isCancel(error)) {
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <VStack h="60vh" justify="center" gap={4}>
        <Box color="teal.500">
          <Loader2 className="animate-spin" size={40} />
        </Box>

        <Text color="gray.500" fontWeight="medium">
          Dashboard loading...
        </Text>
      </VStack>
    );
  }

  if (stats.totalTrips === -1) return null;

  return (
    <Box {...styles.container}>
      <HStack justify="space-between" align="end" mb={8} wrap="wrap" gap={4}>
        <VStack align="start" gap={0}>
          <Text {...styles.headerLabel}>OVERVIEW</Text>
          <Heading {...styles.mainHeading}>
            Welcome back, {user?.firstName || "traveler"} 👋
          </Heading>
        </VStack>
        <Button
          colorPalette="teal"
          size="lg"
          borderRadius="xl"
          onClick={() => navigate("/trips/new")}
        >
          <Plus size={20} /> Add New Trip
        </Button>
      </HStack>

      {stats.totalTrips === 0 ? (
        <EmptyState onAction={() => navigate("/trips/new")} />
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, xl: 3 }} gap={6} mb={10}>
            <StatCard
              icon={Car}
              label="TOTAL TRIPS"
              value={stats.totalTrips}
              color="blue"
            />
            <StatCard
              icon={Calendar}
              label="DAYS ON THE ROAD"
              value={stats.totalDays}
              color="green"
            />
            <StatCard
              label="BUDGET (USED / PLANNED)"
              value={
                <HStack gap={1} alignItems="baseline">
                  <Text
                    fontSize="2xl"
                    fontWeight="black"
                    color={
                      stats.totalSpent > stats.totalPlanned
                        ? "red.500"
                        : "teal.500"
                    }
                  >
                    {Number(stats.totalSpent).toLocaleString()} €
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="bold">
                    / {Number(stats.totalPlanned).toLocaleString()} €
                  </Text>
                </HStack>
              }
              icon={Wallet}
              color="orange"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
            <Card.Root {...styles.cardRoot}>
              <Box {...styles.nextAdventureHeader}>
                <HStack justify="space-between">
                  <Badge {...styles.badge}>Next trip</Badge>
                  <Circle size="35px" bg="whiteAlpha.200">
                    <Calendar size={18} color="white" />
                  </Circle>
                </HStack>
              </Box>
              <Card.Body p={6}>
                {upcomingTrip ? (
                  <Flex direction="column" justify="space-between" h="full">
                    <Box>
                      <Heading size="xl" mb={2}>
                        {upcomingTrip.title}
                      </Heading>
                      <Text color="gray.500" lineClamp={3}>
                        {upcomingTrip.description || "It's time to pack!"}
                      </Text>
                    </Box>
                    <HStack mt={8} justify="space-between" align="flex-end">
                      <VStack align="start" gap={0}>
                        <Text {...styles.headerLabel}>STARTS</Text>
                        <Text fontWeight="extrabold" fontSize="lg">
                          {formatDate(upcomingTrip.startDate)}
                        </Text>
                      </VStack>
                      <Button
                        {...styles.detailsButton}
                        onClick={() => navigate(`/trips/${upcomingTrip._id}`)}
                      >
                        DETAILS
                        <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                      </Button>
                    </HStack>
                  </Flex>
                ) : (
                  <VStack py={10} color="gray.400">
                    <Text>No trips planned.</Text>
                  </VStack>
                )}
              </Card.Body>
            </Card.Root>

            <Card.Root {...styles.cardRoot} p={6}>
              <Heading size="md" mb={6}>
                Budgets for last 5 trips
              </Heading>
              <Box {...styles.chartsBox}>
                <ResponsiveContainer width="99%" height={300} debounce={1}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                  >
                    <CartesianGrid {...styles.chartGrid(false)} />
                    <XAxis {...styles.xaxis} dataKey="name" />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} />
                    <Bar dataKey="budget" radius={[6, 6, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card.Root>
          </SimpleGrid>
        </>
      )}
    </Box>
  );
};
