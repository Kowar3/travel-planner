import { Input, Field, Box, HStack } from "@chakra-ui/react";
import { Mail, Lock, User, AtSign } from "lucide-react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  rightElement,
}: FormInputProps) => {
  const getIcon = () => {
    const iconProps = { size: 18, strokeWidth: 2.5 };

    switch (name) {
      case "firstName":
      case "lastName":
        return (
          <User size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
        );
      case "email":
        return (
          <AtSign size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
        );
      case "password":
      case "confirmPassword":
        return (
          <Lock size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
        );
      default:
        return (
          <Mail size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
        );
    }
  };

  return (
    <Field.Root invalid={!!error} width="full">
      <HStack mb={1} ml={1} alignItems="center">
        <Box color="gray.400">{getIcon()}</Box>
        <Field.Label fontSize="xs" fontWeight="bold" color="gray.500">
          {label.toUpperCase()}
        </Field.Label>
      </HStack>

      <Box position="relative" w="full">
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          bg={{ base: "gray.50", _dark: "whiteAlpha.50" }}
          h="11"
          borderRadius="xl"
          pr={rightElement ? "40px" : undefined}
          _focus={{
            bg: { base: "white", _dark: "gray.800" },
            borderColor: error ? "red.500" : "teal.500",
            ring: "none",
          }}
        />

        {rightElement && (
          <Box
            position="absolute"
            right="10px"
            top="50%"
            transform="translateY(-50%)"
          >
            {rightElement}
          </Box>
        )}
      </Box>
      {error && (
        <Field.ErrorText
          fontSize="13px"
          fontWeight="bold"
          color="red.500"
          ml={1}
        >
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};
