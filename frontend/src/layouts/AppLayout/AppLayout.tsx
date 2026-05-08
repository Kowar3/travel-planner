import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Button,
  HStack,
  Text,
  VStack,
  Separator,
  Heading,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  Menu,
  Car,
  Plus,
  Globe,
} from "lucide-react";
import type { ReactNode } from "react";
import { appLayoutstyles as styles } from "./AppLayout.styles";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { ColorModeToggle } from "@/components/ColorModeToggle";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My Trips", to: "/trips", icon: Car },
  { label: "World Map", to: "/worldmap", icon: Globe },
  { label: "Profile", to: "/profile", icon: User },
];

const getHeaderTitle = (path: string) => {
  if (path === "/dashboard") return "Dashboard";
  if (path === "/trips/new") return "Add trip";
  if (path.startsWith("/trips/")) return "Trip details";
  if (path === "/trips") return "All trips";
  return path.replace("/", "").charAt(0).toUpperCase() + path.slice(2);
};

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggleSidebar = () => {
    const newState = !isCollapsed;

    setIsCollapsed(newState);

    localStorage.setItem("sidebar_collapsed", JSON.stringify(newState));

    window.dispatchEvent(new Event("sidebar-toggle"));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsCollapsed(true);

        localStorage.setItem("sidebar_collapsed", JSON.stringify(true));

        window.dispatchEvent(new Event("sidebar-toggle"));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed]);

  const NavLink = ({ to, icon: Icon, label, onClick }: any) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{ width: "100%" }} onClick={onClick}>
        <HStack {...styles.menuItem(isActive, isCollapsed)}>
          <Icon size={22} strokeWidth={isActive ? 3 : 2} />
          <Box display={{ base: "block", sm: isCollapsed ? "none" : "block" }}>
            <Text fontWeight={isActive ? "bold" : "medium"}>{label}</Text>
          </Box>
        </HStack>
      </Link>
    );
  };

  return (
    <Flex {...styles.mainWrapper}>
      <Box ref={sidebarRef} {...styles.sidebar(isCollapsed)}>
        <VStack h="full" align="stretch">
          <HStack mb={6} justify="space-between" px={2}>
            {!isCollapsed && (
              <Heading {...styles.sidebarHeading}>TravelPlanner</Heading>
            )}
            <IconButton
              {...styles.collapseButton}
              onClick={handleToggleSidebar}
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </IconButton>
          </HStack>

          <Box px={isCollapsed ? 0 : 2} mb={8}>
            <Link to="/trips/new" style={{ width: "100%" }}>
              <Button {...styles.addBtn(isCollapsed)}>
                <Plus size={24} strokeWidth={3} />
                {!isCollapsed && (
                  <Text fontWeight="black" ml={2}>
                    ADD NEW TRIP
                  </Text>
                )}
              </Button>
            </Link>
          </Box>

          <VStack gap={2} flex="1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </VStack>

          <Separator borderColor="whiteAlpha.100" my={6} />
          <Button {...styles.logoutButton(isCollapsed)} onClick={logout} mb={4}>
            <LogOut size={20} />
            {!isCollapsed && (
              <Text ml={3} fontWeight="bold">
                Logout
              </Text>
            )}
          </Button>
        </VStack>
      </Box>

      {isMobileOpen && (
        <Box {...styles.mobileMain}>
          <HStack justify="space-between" mb={10}>
            <Heading color="white" size="xl">
              Menu
            </Heading>
            <IconButton
              variant="ghost"
              color="white"
              onClick={() => setIsMobileOpen(false)}
            >
              <Plus size={32} style={{ transform: "rotate(45deg)" }} />
            </IconButton>
          </HStack>

          <Box mb={8}>
            <Link
              to="/trips/new"
              style={{ width: "100%" }}
              onClick={() => setIsMobileOpen(false)}
            >
              <Button {...styles.addBtnMobile}>
                <Plus size={24} strokeWidth={3} />
                <Text fontWeight="black" ml={2}>
                  ADD NEW TRIP
                </Text>
              </Button>
            </Link>
          </Box>

          <VStack gap={4} align="stretch">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                {...item}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}

            <Separator borderColor="whiteAlpha.200" my={4} />

            <Button {...styles.logoutBtnMobile} onClick={logout}>
              <LogOut size={22} /> Logout
            </Button>
          </VStack>
        </Box>
      )}

      <Box {...styles.outNavbar}>
        <Flex {...styles.topNavbar}>
          <HStack gap={{ base: 2, md: 4 }}>
            <IconButton
              display={{ base: "flex", sm: "none" }}
              variant="ghost"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </IconButton>

            <Image
              src="/logo.png"
              alt="Logo"
              h={{ base: "40px", md: "60px" }}
              w="auto"
            />

            <Separator
              orientation="vertical"
              height="24px"
              borderColor="gray.300"
            />

            <Text {...styles.pageTitle}>
              {getHeaderTitle(location.pathname)}
            </Text>
          </HStack>

          <HStack gap={{ base: 3, md: 6 }}>
            <ColorModeToggle />
            <Link to="/profile">
              <Box {...styles.userBadge}>
                <HStack gap={3}>
                  <User size={18} />
                  <Text fontWeight="bold" fontSize="sm">
                    {user ? `${user.firstName + " " + user.lastName}` : "User"}
                  </Text>
                </HStack>
              </Box>
              <IconButton {...styles.userMobile}>
                <User size={20} />
              </IconButton>
            </Link>
          </HStack>
        </Flex>

        <Box p={{ base: 4, md: 10 }} flex="1">
          <Box maxW="1400px" mx="auto">
            {children}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
