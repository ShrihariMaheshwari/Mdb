import { Box, Heading, VStack } from '@chakra-ui/react';
import { CollectionsList } from '../components/collections/CollectionList';
import { useCollections } from '../hooks/useCollections';

export function CollectionsPage() {
  const { collections, loading, error, refresh } = useCollections();

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;

  return (
    <VStack align="stretch" spacing={6}>
      <Heading>Collections</Heading>
      <CollectionsList 
        collections={collections} 
        onCollectionCreate={refresh}
      />
    </VStack>
  );
}