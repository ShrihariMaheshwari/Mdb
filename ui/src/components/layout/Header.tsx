import { Flex, Heading, Button, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={4}
      px={8}
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderBottom="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
    >
      <Heading size="md">MDB Dashboard</Heading>
      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Flex>
  );
}
