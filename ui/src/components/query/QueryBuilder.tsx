// src/components/query/QueryBuilder.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Select,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { QueryFilter } from "../../types";

interface QueryBuilderProps {
  onQuery: (filter: QueryFilter) => void;
}

interface Condition {
  field: string;
  operator: string;
  value: string;
}

export function QueryBuilder({ onQuery }: QueryBuilderProps) {
  const { colorMode } = useColorMode();
  const [conditions, setConditions] = useState<Condition[]>([
    { field: "", operator: "$eq", value: "" },
  ]);
  const toast = useToast();

  const operators = [
    { value: "$eq", label: "Equals" },
    { value: "$ne", label: "Not Equals" },
    { value: "$gt", label: "Greater Than" },
    { value: "$gte", label: "Greater Than or Equal" },
    { value: "$lt", label: "Less Than" },
    { value: "$lte", label: "Less Than or Equal" },
    { value: "$in", label: "In" },
    { value: "$nin", label: "Not In" },
    { value: "$regex", label: "Matches Regex" },
  ];

  const updateCondition = (
    index: number,
    field: keyof Condition,
    value: string
  ) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    setConditions(updated);
  };

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "$eq", value: "" }]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const handleSearch = () => {
    try {
      const filter = conditions.reduce((acc, condition) => {
        if (condition.field && condition.value) {
          let parsedValue: string | number | any[] = condition.value;

          // Handle numeric values for comparison operators
          if (["$gt", "$gte", "$lt", "$lte"].includes(condition.operator)) {
            const numValue = Number(parsedValue);
            if (isNaN(numValue)) {
              throw new Error(`Value for ${condition.field} must be a number`);
            }
          }

          // Handle array values for $in and $nin
          if (["$in", "$nin"].includes(condition.operator)) {
            try {
              const arrayValue = JSON.parse(parsedValue);
              if (!Array.isArray(arrayValue)) {
                throw new Error();
              }
              parsedValue = arrayValue;
            } catch {
              throw new Error(
                `Value for ${condition.field} must be a valid array (e.g., [1,2,3])`
              );
            }
          }

          acc[condition.field] = { [condition.operator]: parsedValue };
        }
        return acc;
      }, {} as QueryFilter);

      onQuery(filter);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Invalid Query",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      p={6}
      bg={colorMode === "dark" ? "gray.800" : "white"}
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
    >
      <Text
        fontSize="lg"
        fontWeight="semibold"
        mb={4}
        color={colorMode === "dark" ? "white" : "gray.700"}
      >
        Query Builder
      </Text>

      <VStack spacing={4} align="stretch">
        {conditions.map((condition, index) => (
          <HStack key={index} spacing={4}>
            <Input
              placeholder="Field name"
              value={condition.field}
              onChange={(e) => updateCondition(index, "field", e.target.value)}
              bg={colorMode === "dark" ? "gray.700" : "white"}
              borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
              color={colorMode === "dark" ? "white" : "black"}
              _placeholder={{
                color: colorMode === "dark" ? "gray.400" : "gray.500",
              }}
              _hover={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
              }}
              _focus={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
                boxShadow: `0 0 0 1px ${
                  colorMode === "dark" ? "#4299E1" : "#3182CE"
                }`,
              }}
            />

            <Select
              value={condition.operator}
              onChange={(e) =>
                updateCondition(index, "operator", e.target.value)
              }
              bg={colorMode === "dark" ? "gray.700" : "white"}
              borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
              color={colorMode === "dark" ? "white" : "black"}
              _hover={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
              }}
              _focus={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
                boxShadow: `0 0 0 1px ${
                  colorMode === "dark" ? "#4299E1" : "#3182CE"
                }`,
              }}
            >
              {operators.map((op) => (
                <option
                  key={op.value}
                  value={op.value}
                  style={{
                    background: colorMode === "dark" ? "#2D3748" : "white",
                    color: colorMode === "dark" ? "white" : "black",
                  }}
                >
                  {op.label}
                </option>
              ))}
            </Select>

            <Input
              placeholder="Value"
              value={condition.value}
              onChange={(e) => updateCondition(index, "value", e.target.value)}
              bg={colorMode === "dark" ? "gray.700" : "white"}
              borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
              color={colorMode === "dark" ? "white" : "black"}
              _placeholder={{
                color: colorMode === "dark" ? "gray.400" : "gray.500",
              }}
              _hover={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
              }}
              _focus={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
                boxShadow: `0 0 0 1px ${
                  colorMode === "dark" ? "#4299E1" : "#3182CE"
                }`,
              }}
            />

            <IconButton
              aria-label="Remove condition"
              icon={<DeleteIcon />}
              onClick={() => removeCondition(index)}
              isDisabled={conditions.length === 1}
              color={colorMode === "dark" ? "red.300" : "red.500"}
              bg="transparent"
              _hover={{
                bg: colorMode === "dark" ? "whiteAlpha.100" : "red.50",
              }}
            />
          </HStack>
        ))}
      </VStack>

      <HStack mt={6} spacing={4}>
        <Button
          leftIcon={<AddIcon />}
          onClick={addCondition}
          variant="outline"
          color={colorMode === "dark" ? "blue.200" : "blue.500"}
          borderColor={colorMode === "dark" ? "blue.200" : "blue.500"}
          _hover={{
            bg: colorMode === "dark" ? "whiteAlpha.100" : "blue.50",
          }}
        >
          Add Condition
        </Button>

        <Button
          onClick={handleSearch}
          bg={colorMode === "dark" ? "blue.500" : "blue.500"}
          color="white"
          _hover={{
            bg: colorMode === "dark" ? "blue.600" : "blue.600",
          }}
        >
          Search
        </Button>
      </HStack>
    </Box>
  );
}

export default QueryBuilder;
