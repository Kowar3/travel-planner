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
import type { Destination, Expense } from "@/types/types";

export const ExpenseSection = ({
  destination,
  onUpdate,
}: {
  destination: Destination;
  onUpdate?: () => void;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Error saving expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.info("Expense deleted.");
      loadExpenses();
      onUpdate?.();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  return (
    <Box height="480px" display="flex" flexDirection="column">
      <HStack mb={3} color="orange.500">
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

      <Box
        flex="1"
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
        <VStack gap={3} align="stretch">
          {expenses.length > 0 ? (
            expenses.map((exp) => (
              <Box
                key={exp._id}
                p={3}
                bg={{ base: "white", _dark: "whiteAlpha.100" }}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }}
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
                        {new Date(exp.startDate).toLocaleDateString()}
                        {exp.startDate !== exp.endDate &&
                          ` - ${new Date(exp.endDate).toLocaleDateString()}`}
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
              flex="1"
              h="180px"
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
      >
        <VStack gap={2.5}>
          <Input
            size="sm"
            bg={{ base: "white", _dark: "gray.900" }}
            borderRadius="xl"
            placeholder="Expense description (e.g. Dinner)..."
            value={formData.title}
            border="none"
            _focus={{ ring: "2px", ringColor: "orange.400" }}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <HStack width="full" gap={2}>
            <Box flex="1.5">
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  bg={{ base: "white", _dark: "gray.900" }}
                  borderRadius="xl"
                  border="none"
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
              flex="1"
              size="sm"
              type="number"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              placeholder="€"
              border="none"
              _focus={{ ring: "2px", ringColor: "orange.400" }}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </HStack>

          <HStack width="full" gap={2}>
            <Input
              size="sm"
              type="date"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              border="none"
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
              size="sm"
              type="date"
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              border="none"
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
