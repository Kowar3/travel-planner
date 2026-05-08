import { useState, useMemo } from "react";
import {
  VStack,
  Heading,
  Text,
  HStack,
  Link as ChakraLink,
  SimpleGrid,
  Box,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

import { registerStyles as styles } from "./Register.styles";
import { validateEmail, validateName, validatePassword } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext/AuthContext";
import api from "@/api/axios";
import { FormInput } from "@/components/FormInput";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const getErrors = () => {
    return {
      firstName: validateName(formData.firstName),
      lastName: validateName(formData.lastName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.confirmPassword &&
        formData.confirmPassword !== formData.password
          ? "Passwords do not match"
          : "",
    };
  };

  const allErrors = useMemo(() => getErrors(), [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (serverError) setServerError("");
  };

  const handleRegister = async () => {
    setLoading(true);
    setServerError("");
    try {
      const { confirmPassword, ...registrationData } = formData;

      const response = await api.post("/auth/register", registrationData);

      if (response.data.token) {
        login(response.data.token);
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setServerError("Network error! Check your connection!");
        } else {
          const message =
            error.response.data?.message || "Registration failed!";
          setServerError(message);
        }
      } else {
        setServerError("An unexpected error occurred!");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !Object.values(allErrors).some(Boolean);

  return (
    <VStack
      {...styles.card}
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (isFormComplete && !loading) handleRegister();
      }}
    >
      <VStack gap={1} textAlign="center">
        <Heading size="2xl" {...styles.heading}>
          Join us
        </Heading>
        <Text {...styles.text} mb={"10px"}>
          Create your account to start planning.
        </Text>
      </VStack>

      <VStack gap={4} width="full">
        {serverError && (
          <Box {...styles.errorBox}>
            <Text
              color={{ base: "red.700", _dark: "red.200" }}
              fontSize="xs"
              fontWeight="bold"
            >
              {serverError}
            </Text>
          </Box>
        )}

        <SimpleGrid columns={2} gap={3} width="full">
          <FormInput
            label="First Name"
            name="firstName"
            placeholder="Enter firstname..."
            value={formData.firstName}
            error={allErrors.firstName}
            onChange={handleChange}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            placeholder="Enter lastname..."
            value={formData.lastName}
            error={allErrors.lastName}
            onChange={handleChange}
          />
        </SimpleGrid>

        <FormInput
          label="Email address"
          name="email"
          type="email"
          placeholder="Enter your email..."
          value={formData.email}
          error={allErrors.email}
          onChange={handleChange}
        />

        <SimpleGrid columns={2} gap={3} width="full">
          <FormInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password..."
            value={formData.password}
            error={allErrors.password}
            onChange={handleChange}
            rightElement={
              <IconButton
                variant="ghost"
                aria-label="Toggle password"
                onClick={() => setShowPassword(!showPassword)}
                size="sm"
                _hover={{ bg: "transparent" }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </IconButton>
            }
          />
          <FormInput
            label="Confirm"
            name="confirmPassword"
            type={showPasswordAgain ? "text" : "password"}
            placeholder="Password again..."
            value={formData.confirmPassword}
            error={allErrors.confirmPassword}
            onChange={handleChange}
            rightElement={
              <IconButton
                variant="ghost"
                aria-label="Toggle password"
                onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                size="sm"
                _hover={{ bg: "transparent" }}
              >
                {showPasswordAgain ? <FiEyeOff /> : <FiEye />}
              </IconButton>
            }
          />
        </SimpleGrid>

        <Button
          {...styles.button}
          width="full"
          type="submit"
          loading={loading}
          loadingText="Kreiranje..."
          disabled={!isFormComplete || loading}
        >
          Create account
        </Button>

        <HStack fontSize="md" color="gray.500" mt={2}>
          <Text>Already have an account?</Text>
          <ChakraLink asChild color="teal.500" fontWeight="extrabold">
            <Link to="/">Login</Link>
          </ChakraLink>
        </HStack>
      </VStack>
    </VStack>
  );
};
