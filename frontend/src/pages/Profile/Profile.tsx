import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  Circle,
  SimpleGrid,
  Separator,
  Badge,
} from "@chakra-ui/react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { useState, useEffect } from "react";
import api from "@/api/axios";
import { toast } from "react-toastify";
import { profileStyles as styles } from "./Profile.styles";
import { formatDateYearMonth } from "@/utils/helpers";
import axios from "axios";

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });

  const isSomethingChanged =
    formData.firstName !== (user?.firstName || "") ||
    formData.lastName !== (user?.lastName || "");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isSomethingChanged && !loading) {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put("/users/profile", formData);

      if (res.data && setUser) {
        setUser(res.data);

        toast.success("Profile updated successfully!");
      }
    } catch (error: unknown) {
      let errorMessage = "Error saving data. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pb={{ base: "60px", md: "20px" }} px={{ base: 4, md: 8 }}>
      <VStack {...styles.headerSection}>
        <Text {...styles.label}>MY ACCOUNT</Text>
        <Heading size="2xl" fontWeight="black">
          User profile
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        <Card.Root {...styles.mainCard}>
          <Card.Body p={8}>
            <VStack gap={6}>
              <Circle {...styles.avatarCircle}>
                <UserIcon size={60} />
              </Circle>
              <VStack gap={1} textAlign="center">
                <Heading size="xl">
                  {user?.firstName} {user?.lastName}
                </Heading>
                <Badge colorPalette="teal" variant="subtle">
                  Active account
                </Badge>
              </VStack>

              <Separator />

              <VStack w="full" align="start" gap={4}>
                <HStack gap={3}>
                  <Circle {...styles.infoIconCircle("blue")}>
                    <Mail size={16} />
                  </Circle>
                  <Box>
                    <Text fontSize="xs" color="gray.400" fontWeight="bold">
                      EMAIL
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {user?.email}
                    </Text>
                  </Box>
                </HStack>
                <HStack gap={3}>
                  <Circle {...styles.infoIconCircle("purple")}>
                    <Calendar size={16} />
                  </Circle>
                  <Box>
                    <Text fontSize="xs" color="gray.400" fontWeight="bold">
                      MEMBER SINCE
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {formatDateYearMonth(user?.createdAt)}
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root {...styles.mainCard} gridColumn={{ lg: "span 2" }}>
          <Card.Header p={8} pb={0}>
            <HStack justify="space-between">
              <Box>
                <Heading size="md">Main information</Heading>
                <Text color="gray.500" fontSize="sm">
                  Change your firstname and lastname
                </Text>
              </Box>
              <Box color="teal.500">
                <ShieldCheck size={24} />
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body p={8}>
            <VStack gap={8} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Firstname
                  </Text>
                  <Input
                    {...styles.inputField}
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                  />
                </VStack>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Lastname
                  </Text>
                  <Input
                    {...styles.inputField}
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                  />
                </VStack>
              </SimpleGrid>

              <Box {...styles.infoBox}>
                <Text {...styles.infoText}>INFO</Text>
                <Text fontSize="sm" color="gray.500">
                  Your email address is associated with the account and cannot
                  be changed for security reasons.
                </Text>
              </Box>

              <HStack justify="flex-end" pt={4}>
                <Button
                  {...styles.cancelButton}
                  onClick={() =>
                    setFormData({
                      firstName: user?.firstName || "",
                      lastName: user?.lastName || "",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  {...styles.saveButton}
                  disabled={!isSomethingChanged || loading}
                  onClick={handleSave}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
};
