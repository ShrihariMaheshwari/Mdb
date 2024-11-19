import { Box, Button, Heading, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Collection } from "../../types";
import { CreateCollectionModal } from "./CreateCollectionModal";

interface CollectionsListProps {
  collections: Collection[];
  onCollectionCreate: () => void;
}

export function CollectionsList({ collections, onCollectionCreate }: CollectionsListProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <Box>
        <Button leftIcon={<AddIcon />} onClick={onOpen} mb={4}>
          Create Collection
        </Button>
  
        {collections.length === 0 ? (
          <Text>No collections yet. Create your first collection to get started.</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {collections.map((collection) => (
              collection.name && (  // Only render if name exists
                <Box
                  key={collection.name}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  _hover={{ shadow: "md" }}
                >
                  <Heading size="md">{collection.name}</Heading>
                  <Text mt={2} color="gray.600">
                    {collection.count} documents
                  </Text>
                </Box>
              )
            ))}
          </SimpleGrid>
        )}
  
        <CreateCollectionModal
          isOpen={isOpen}
          onClose={onClose}
          onCreate={onCollectionCreate}
        />
      </Box>
    );
  }