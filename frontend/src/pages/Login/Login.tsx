import { useState, useMemo } from "react";
import {
  VStack,
  Heading,
  Text,
  HStack,
  Link as ChakraLink,
  Box,
  Button,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

import { loginStyles as styles } from "./Login.styles";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { validateEmail } from "@/utils/helpers";
import api from "@/api/axios";
import { FormInput } from "@/components/FormInput";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface ApiError {
  message: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const getErrors = () => {
    return {
      email: validateEmail(formData.email),
      password: formData.password ? "" : "Password is required",
    };
  };

  const allErrors = useMemo(() => getErrors(), [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (serverError) setServerError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    setServerError("");
    try {
      const response = await api.post("/auth/login", formData);
      await login(response.data.token);
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      let errorMessage = "Invalid email or password!";

      if (axios.isAxiosError<ApiError>(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.email &&
    formData.password &&
    !Object.values(allErrors).some(Boolean);

  return (
    <VStack
      {...styles.card}
      as="form"
      onKeyDown={(e) =>
        e.key === "Enter" && isFormValid && !loading && handleLogin()
      }
    >
      <VStack gap={3} textAlign="center">
        <Image src="/logo.png" alt="Logo" {...styles.logo} />

        <VStack gap={1}>
          <Heading {...styles.heading}>Welcome Back</Heading>
          <Text {...styles.text}>Login to continue your journey</Text>
        </VStack>
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

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email..."
          value={formData.email}
          onChange={handleChange}
          error={allErrors.email}
        />

        <FormInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password..."
          value={formData.password}
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

        <Button
          {...styles.button}
          disabled={!isFormValid}
          loading={loading}
          loadingText="Signing in..."
          onClick={handleLogin}
          type="button"
        >
          Sign In
        </Button>

        <HStack fontSize="md" color="gray.500" pt={2}>
          <Text>Don't have an account?</Text>
          <ChakraLink asChild color="teal.500" fontWeight="extrabold">
            <Link to="/register">Create one</Link>
          </ChakraLink>
        </HStack>
      </VStack>
    </VStack>
  );
};
