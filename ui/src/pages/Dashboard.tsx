import { Box, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useCollections } from '../hooks/useCollections';
import { CollectionsList } from '../components/collections/CollectionList';

export function Dashboard() {
  const { collections, loading, error, refresh } = useCollections();

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;

  return (
    <Box>
      <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total Collections</StatLabel>
          <StatNumber>{collections.length}</StatNumber>
        </Stat>
      </SimpleGrid>
      
      <CollectionsList collections={collections} onCollectionCreate={refresh} />
    </Box>
  );
}