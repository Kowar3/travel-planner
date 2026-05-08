import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Center, Spinner, VStack, Text, Box } from "@chakra-ui/react";
import { Plane } from "lucide-react";
import { protectedStyles as styles } from "./ProtectedRoute.styles";
import { useAuth } from "@/context/AuthContext/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center {...styles.container}>
        <VStack gap={4}>
          <Box {...styles.iconBox}>
            <Plane color="white" size={32} />
          </Box>
          <Spinner {...styles.spinner} />
          <Text {...styles.text}>PREPARING YOUR ADVENTURE...</Text>
        </VStack>
      </Center>
    );
  }

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
