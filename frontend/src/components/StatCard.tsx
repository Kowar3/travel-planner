import { Card, HStack, Circle, VStack, Text, Box } from "@chakra-ui/react";
import { Tooltip } from "@/components/Tooltip";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  color: string;
  info?: string;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  info,
}: StatCardProps) => {
  const cardContent = (
    <Card.Root
      borderRadius="3xl"
      border="1px solid"
      borderColor={{ base: "gray.100", _dark: "whiteAlpha.50" }}
      shadow={{ base: "md", _dark: "none" }}
      bg={{ base: "white", _dark: "gray.900" }}
      overflow="hidden"
      p={5}
      transition="all 0.2s"
      _hover={
        info
          ? { transform: "translateY(-2px)", shadow: "lg", cursor: "pointer" }
          : {}
      }
    >
      <HStack gap={4}>
        <Circle size="48px" bg={`${color}.500/10`} color={`${color}.500`}>
          <Icon size={24} />
        </Circle>

        <VStack align="start" gap={0}>
          <Text
            fontSize="10px"
            color="gray.400"
            fontWeight="black"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            {label}
          </Text>

          <Box fontSize="2xl" fontWeight="black" lineHeight="1.2">
            {value}
          </Box>
        </VStack>
      </HStack>
    </Card.Root>
  );

  if (!info) return cardContent;

  return (
    <Tooltip content={info} showArrow portalled={false}>
      {cardContent}
    </Tooltip>
  );
};
