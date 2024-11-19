// src/pages/Dashboard.tsx
import {
    Box,
    SimpleGrid,
    Card,
    CardBody,
    Heading,
    Button,
    Text,
    VStack,
    useDisclosure
  } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";
  import { useCollections } from "../hooks/useCollections";
  import { CreateCollectionModal } from "../components/collections/CreateCollectionModal";
  
  export function Dashboard() {
    const { collections, loading, error, refresh } = useCollections();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
  
    if (loading) return <Box>Loading...</Box>;
    if (error) return <Box>Error: {error.message}</Box>;
  
    const totalDocuments = collections.reduce((acc, col) => acc + col.count, 0);
    const largestCollection = collections.reduce((prev, curr) => 
      prev.count > curr.count ? prev : curr, 
      { name: 'None', count: 0 }
    );
  
    return (
      <Box>
        <SimpleGrid columns={[1, 1, 3]} spacing={6} mb={8}>
          <Card>
            <CardBody>
              <Heading size="md">Total Collections</Heading>
              <Text fontSize="2xl">{collections.length}</Text>
            </CardBody>
          </Card>
  
          <Card>
            <CardBody>
              <Heading size="md">Total Documents</Heading>
              <Text fontSize="2xl">{totalDocuments}</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
  
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>Recent Collections</Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {collections.map(collection => (
                <Card 
                  key={collection.name} 
                  cursor="pointer"
                  onClick={() => navigate(`/collections/${collection.name}`)}
                >
                  <CardBody>
                    <Heading size="md">{collection.name}</Heading>
                    <Text>{collection.count} documents</Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
  
          <SimpleGrid columns={[1, 2]} spacing={6}>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Quick Actions</Heading>
                <VStack spacing={4}>
                  <Button width="full" colorScheme="blue" onClick={onOpen}>
                    Create New Collection
                  </Button>
                  <Button 
                    width="full" 
                    onClick={() => navigate('/collections')}
                  >
                    View All Collections
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
  
        <CreateCollectionModal
          isOpen={isOpen}
          onClose={onClose}
          onCreate={refresh}
        />
      </Box>
    );
  }