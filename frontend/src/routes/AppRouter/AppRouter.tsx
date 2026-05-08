import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { Flex, Spinner } from "@chakra-ui/react";

import { AuthLayout } from "@/layouts/AuthLayout/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout/AppLayout";

import { useAuth } from "@/context/AuthContext/AuthContext";
import { Login } from "@/pages/Login/Login";
import { Register } from "@/pages/Register/Register";
import { Dashboard } from "@/pages/Dashboard/Dashboard";
import { Trips } from "@/pages/Trips/Trips";
import { CreateTrip } from "@/pages/CreateTrip/CreateTrip";
import { TripDetails } from "@/pages/TripDetails/TripDetails";
import { Profile } from "@/pages/Profile/Profile";
import { routerStyles as styles } from "./AppRouter.styles";

import { WorldMap } from "@/pages/WorldMap/WorldMap";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoutes";
import { NotFound } from "@/pages/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import { useToastTheme } from "@/hooks/useToastTheme";
import "react-toastify/dist/ReactToastify.css";

export const AppRouter = () => {
  const { token, loading } = useAuth();
  const toastTheme = useToastTheme();

  if (loading) {
    return (
      <Flex {...styles.spinnerContainer}>
        <Spinner {...styles.spinner} />
      </Flex>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer
        key={toastTheme}
        theme={toastTheme}
        position="bottom-right"
        autoClose={1500}
        limit={3}
      />
      <Routes>
        <Route
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            )
          }
        >
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/worldmap" element={<WorldMap />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
