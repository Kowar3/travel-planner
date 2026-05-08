import { useTheme } from "next-themes";
import type { ToastContainerProps } from "react-toastify";

export const useToastTheme = (): ToastContainerProps["theme"] => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? "light" : "dark";
};
