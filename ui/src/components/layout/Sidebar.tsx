import { Box, VStack, Text, List, ListItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  collections: string[];
}

export function Sidebar({ collections }: SidebarProps) {
  return (
    <Box
      as="nav"
      width="240px"
      height="100vh"
      borderRight="1px"
      borderColor="gray.200"
      p={4}
    >
      <VStack align="stretch" spacing={4}>
        <Text fontWeight="bold" fontSize="lg">Collections</Text>
        <List spacing={2}>
          {collections.map(collection => (
            <ListItem key={collection}>
              <Link to={`/collections/${collection}`}>
                <Text cursor="pointer" _hover={{ color: 'blue.500' }}>
                  {collection}
                </Text>
              </Link>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
}