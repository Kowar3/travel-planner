import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Skeleton,
  Stack,
  HStack,
  Progress,
  VStack,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  type PieLabelRenderProps,
} from "recharts";
import { MapPin, Ticket, Wallet, TrendingUp } from "lucide-react";

import { StatCard } from "./StatCard";
import api from "@/api/axios";

interface CategoryBreakdown {
  category: string;
  amount: number;
}

interface TripStats {
  plannedBudget: number;
  totalSpent: number;
  destinations: number;
  activities: number;
  categoryBreakdown: CategoryBreakdown[];
}

const COLORS = [
  "#4FD1C5",
  "#F6AD55",
  "#63B3ED",
  "#F687B3",
  "#9F7AEA",
  "#F56565",
];

const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelRenderProps) => {
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const RADIAN = Math.PI / 180;

  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  if (percent === 1) {
    return (
      <text
        x={cx}
        y={cy}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
        fontSize="16"
      >
        100%
      </text>
    );
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
      fontSize="11px"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const Statistics = ({
  tripId,
  refreshTrigger,
}: {
  tripId: string;
  refreshTrigger: number;
}) => {
  const [data, setData] = useState<TripStats | null>(null);
  const [loading, setLoading] = useState(true);

  const pieRadius = useBreakpointValue({ base: 65, sm: 100 });

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar_collapsed") === "false",
  );

  useEffect(() => {
    if (tripId) loadStats();
  }, [tripId, refreshTrigger]);

  useEffect(() => {
    const handleSidebarChange = () => {
      setCollapsed(localStorage.getItem("sidebar_collapsed") === "false");
    };

    window.addEventListener("sidebar-toggle", handleSidebarChange);

    return () => {
      window.removeEventListener("sidebar-toggle", handleSidebarChange);
    };
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/statistics/trip/${tripId}/overview`);
      setData(res.data);
    } catch (error: unknown) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Skeleton
        height="200px"
        width="full"
        borderRadius="3xl"
        bg={{ _dark: "whiteAlpha.100" }}
      />
    );
  if (!data) return null;

  const totalBudget = data.plannedBudget || 0;
  const spentAmount = data.totalSpent || 0;

  let spentPercentage = 0;
  if (totalBudget > 0) {
    spentPercentage = Math.min((spentAmount / totalBudget) * 100, 100);
  } else if (spentAmount > 0) {
    spentPercentage = 100;
  }
  const isOverBudget = spentAmount > totalBudget;

  const coloredData = data.categoryBreakdown?.map(
    (entry: CategoryBreakdown, index: number) => ({
      ...entry,
      fill: COLORS[index % COLORS.length],
    }),
  );

  return (
    <Box width="full" p={2}>
      <SimpleGrid
        columns={collapsed ? 1 : { base: 1, md: 3, lg: 1, "2xl": 3 }}
        gap={4}
        mb={6}
      >
        <StatCard
          label="Destinations"
          value={data.destinations || 0}
          icon={MapPin}
          color="teal"
        />
        <StatCard
          label="Activities"
          value={data.activities || 0}
          icon={Ticket}
          color="blue"
        />
        <StatCard
          label="Total Spent"
          value={`${Number(spentAmount).toLocaleString()} €`}
          icon={Wallet}
          color="orange"
        />
      </SimpleGrid>

      <Stack gap={6}>
        <Card.Root
          p={5}
          borderRadius="3xl"
          bg={{ base: "white", _dark: "whiteAlpha.50" }}
          border="1px solid"
          borderColor={{ _dark: "whiteAlpha.100" }}
        >
          <HStack mb={4} justify="space-between">
            <HStack>
              <TrendingUp size={16} color="#4FD1C5" />
              <Heading
                size="xs"
                textTransform="uppercase"
                color="gray.500"
                letterSpacing="widest"
              >
                Budget Usage
              </Heading>
            </HStack>
            <Badge
              variant="subtle"
              colorPalette={isOverBudget ? "red" : "teal"}
              borderRadius="full"
            >
              {spentPercentage.toFixed(0)}%
            </Badge>
          </HStack>

          <VStack align="stretch" gap={3}>
            <Progress.Root
              value={spentPercentage}
              colorPalette={isOverBudget ? "red" : "teal"}
              size="sm"
              borderRadius="full"
            >
              <Progress.Track bg={{ _dark: "whiteAlpha.100" }}>
                <Progress.Range borderRadius="full" />
              </Progress.Track>
            </Progress.Root>
            <HStack justify="space-between">
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={{ _dark: "whiteAlpha.800" }}
              >
                {spentAmount.toLocaleString()} € spent
              </Text>
              <Text
                fontSize="xs"
                color={totalBudget === 0 ? "orange.400" : "gray.500"}
              >
                {totalBudget === 0
                  ? "No budget set"
                  : `Limit: ${totalBudget.toLocaleString()} €`}
              </Text>
            </HStack>
          </VStack>
        </Card.Root>

        <Card.Root
          p={5}
          borderRadius="3xl"
          bg={{ base: "white", _dark: "whiteAlpha.50" }}
          border="1px solid"
          borderColor={{ _dark: "whiteAlpha.100" }}
        >
          <Heading
            size="xs"
            mb={4}
            textTransform="uppercase"
            color="gray.500"
            letterSpacing="widest"
          >
            Category Breakdown
          </Heading>

          <Box
            w="full"
            h="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {data.categoryBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" aspect={2}>
                <PieChart>
                  <Pie
                    data={coloredData}
                    cx="40%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={pieRadius}
                    dataKey="amount"
                    nameKey="category"
                    stroke="none"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A202C",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                      color: "white",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    formatter={(value, entry: any) => (
                      <span
                        style={{
                          color: "#A0AEC0",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {value}
                        <Text
                          as="span"
                          color={{ base: "gray.800", _dark: "white" }}
                          marginLeft={2}
                        >
                          {entry.payload.amount}€
                        </Text>
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <VStack h="full" justify="center" opacity={0.3}>
                <Text fontSize="xs">No data available</Text>
              </VStack>
            )}
          </Box>
        </Card.Root>
      </Stack>
    </Box>
  );
};
