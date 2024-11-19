import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Collection } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  collections: Collection[];
}

export function Layout({ children, collections }: LayoutProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex h="100vh" bg={colorMode === "dark" ? "gray.900" : "gray.50"}>
      <Sidebar collections={collections} />
      <Flex direction="column" flex="1">
        <Header />
        <Box
          as="main"
          p={8}
          bg={colorMode === "dark" ? "gray.800" : "white"}
          flex="1"
          overflowY="auto"
          borderRadius="xl"
          m={4}
          boxShadow="sm"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
