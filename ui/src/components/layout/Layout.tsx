import { Box, Flex } from "@chakra-ui/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Collection } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  collections: Collection[];
}

export function Layout({ children, collections }: LayoutProps) {
  // Extract collection names for the sidebar
  const collectionNames = collections.map((c) => c.name);
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex flex={1}>
        <Sidebar collections={collectionNames} />
        <Box flex={1} p={8} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
