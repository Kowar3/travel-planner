import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export const ColorModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <IconButton
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      borderRadius="xl"
      color={{ base: "gray.600", _dark: "gray.400" }}
      _hover={{
        bg: { base: "gray.100", _dark: "whiteAlpha.100" },
        color: "teal.500",
      }}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </IconButton>
  );
};
