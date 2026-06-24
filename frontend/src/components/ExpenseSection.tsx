import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Input,
  Button,
  Card,
  NativeSelect,
  HStack,
  Circle,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { Receipt, Plus, Tag, Trash2, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { formatDate } from "@/utils/helpers";
import type { Destination, Expense } from "@/types/types";

const expenseInputStyles = {
  size: "sm" as const,
  h: "32px",
  bg: { base: "white", _dark: "gray.900" },
  borderRadius: "xl",
  border: "1px solid",
  borderColor: { base: "gray.100", _dark: "whiteAlpha.200" },
  outline: "none",
  _focus: {
    borderColor: "orange.400",
    ring: "none",
    outline: "none",
    boxShadow: "none",
  },
};

export const ExpenseSection = ({
  destination,
  onUpdate,
}: {
  destination: Destination;
  onUpdate?: VoidFunction;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const minDate = destination?.startDate
    ? destination.startDate.split("T")[0]
    : "";
  const maxDate = destination?.endDate ? destination.endDate.split("T")[0] : "";

  const [formData, setFormData] = useState({
    title: "",
    category: "food",
    amount: "",
    startDate: minDate,
    endDate: minDate,
  });

  useEffect(() => {
    if (destination?._id) {
      loadExpenses();
      setFormData((prev) => ({
        ...prev,
        startDate: minDate,
        endDate: minDate,
      }));
    }
  }, [destination?._id, minDate]);

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/expenses/${destination._id}`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async () => {
    if (!formData.title.trim()) {
      toast.error("You forgot to enter the description!");
      return;
    }
    if (!formData.amount) {
      toast.error("You forgot to enter the amount!");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/expenses", {
        destinationId: destination._id,
        ...formData,
        amount: Number(formData.amount),
      });

      toast.success("Expense added!");
      setFormData({
        title: "",
        category: "food",
        amount: "",
        startDate: minDate,
        endDate: minDate,
      });
      loadExpenses();
      onUpdate?.();
    } catch (err) {
      toast.error("Error saving expense!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.info("Expense deleted!");
      loadExpenses();
      onUpdate?.();
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  return (
    <Box h="494px" display="flex" flexDirection="column">
      <HStack mb={3} minH="36px" flexShrink={0} justify="space-between" align="center">
        <HStack color="orange.500">
          <Receipt size={16} />
          <Heading
            size="xs"
            textTransform="uppercase"
            letterSpacing="widest"
            color={{ _dark: "orange.300" }}
          >
            Expenses
          </Heading>
        </HStack>
        <NativeSelect.Root size="xs" w="auto" minW="110px">
          <NativeSelect.Field
            bg={{ base: "orange.50", _dark: "whiteAlpha.100" }}
            borderRadius="lg"
            border="1px solid"
            borderColor={{ base: "orange.200", _dark: "whiteAlpha.200" }}
            fontSize="xs"
            h="28px"
            py={0}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="food">🍔 Food</option>
            <option value="transport">🚗 Transport</option>
            <option value="accommodation">🏨 Accommodation</option>
            <option value="recreation">🏊 Entertainment</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="tickets">🎟️ Tickets</option>
            <option value="other">📦 Other</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </HStack>

      <Box
        flex="1"
        minH={0}
        overflowY="auto"
        pr={2}
        mb={3}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: { base: "orange.100", _dark: "whiteAlpha.300" },
            borderRadius: "10px",
          },
        }}
      >
        <VStack gap={3} align="stretch" minH="full">
          {expenses.filter((e) => filterCategory === "all" || e.category === filterCategory).length > 0 ? (
            expenses.filter((e) => filterCategory === "all" || e.category === filterCategory).map((exp) => (
              <Box
                key={exp._id}
                p={3}
                bg={{ base: "orange.50/50", _dark: "whiteAlpha.100" }}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor={{ base: "orange.100", _dark: "whiteAlpha.100" }}
                transition="all 0.2s"
              >
                <HStack justify="space-between">
                  <HStack gap={3}>
                    <Circle size="36px" bg="orange.500/10" color="orange.400">
                      <Tag size={16} />
                    </Circle>
                    <VStack align="start" gap={0}>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={{ _dark: "whiteAlpha.900" }}
                      >
                        {exp.title}
                      </Text>
                      <Text fontSize="10px" color="gray.500">
                        {formatDate(exp.startDate)}
                        {exp.startDate !== exp.endDate &&
                          ` - ${formatDate(exp.endDate)}`}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack gap={1}>
                    <Text fontWeight="black" color="red.400" fontSize="sm">
                      -{Number(exp.amount).toLocaleString()}€
                    </Text>
                    <IconButton
                      variant="ghost"
                      colorPalette="red"
                      size="xs"
                      onClick={() => handleDelete(exp._id)}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </HStack>
                </HStack>
              </Box>
            ))
          ) : (
            <Center
              minH="full"
              bg={{ base: "orange.50/30", _dark: "whiteAlpha.50" }}
              borderRadius="3xl"
              border="2px dashed"
              borderColor={{ base: "orange.100", _dark: "whiteAlpha.200" }}
              p={6}
            >
              <VStack gap={3} textAlign="center">
                <Circle
                  size="52px"
                  bg={{ base: "white", _dark: "gray.800" }}
                  shadow="xl"
                  color="orange.400"
                >
                  <Wallet size={24} />
                </Circle>
                <VStack gap={1}>
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    color={{ _dark: "whiteAlpha.900" }}
                  >
                    Empty wallet?
                  </Text>
                  <Text fontSize="xs" color="gray.500" maxW="180px">
                    Record your expenses to easily track your travel budget.
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
        bg={{ base: "orange.50/50", _dark: "whiteAlpha.100" }}
        border="1px solid"
        borderColor={{ base: "orange.100", _dark: "whiteAlpha.200" }}
        flexShrink={0}
        mt="auto"
        h="186px"
      >
        <VStack gap={2.5} w="full">
          <Input
            {...expenseInputStyles}
            placeholder="Expense description (e.g. Dinner)..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <HStack width="full" gap={2} h="32px">
            <Box flex="1.5" h="32px">
              <NativeSelect.Root size="sm" h="32px">
                <NativeSelect.Field
                  {...expenseInputStyles}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="food">🍔 Food</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="accommodation">🏨 Accommodation</option>
                  <option value="recreation">🏊 Entertainment</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="tickets">🎟️ Tickets</option>
                  <option value="other">📦 Other</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
            <Input
              {...expenseInputStyles}
              flex="1"
              type="number"
              placeholder="€"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </HStack>

          <HStack width="full" gap={2} h="32px">
            <Input
              {...expenseInputStyles}
              flex="1"
              type="date"
              min={minDate}
              max={maxDate}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startDate: e.target.value,
                  endDate:
                    e.target.value < formData.endDate
                      ? formData.endDate
                      : e.target.value,
                })
              }
            />
            <Input
              {...expenseInputStyles}
              flex="1"
              type="date"
              min={formData.startDate}
              max={maxDate}
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </HStack>

          <Button
            width="full"
            h="32px"
            size="sm"
            borderRadius="xl"
            colorPalette="orange"
            loading={isSubmitting}
            onClick={handleAddExpense}
            shadow="lg"
          >
            <Plus size={16} /> Add Expense
          </Button>
        </VStack>
      </Card.Root>
    </Box>
  );
};
