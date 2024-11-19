import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Collection } from "../../types";
import { CreateCollectionModal } from "./CreateCollectionModal";

interface CollectionsListProps {
  collections: Collection[];
  onCollectionCreate: () => void;
}

export function CollectionsList({
  collections,
  onCollectionCreate,
}: CollectionsListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Collections
      </Heading>
      <Button leftIcon={<AddIcon />} onClick={onOpen} mb={4}>
        Create Collection
      </Button>

      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {collections.map((collection) => (
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
        ))}
      </SimpleGrid>

      <CreateCollectionModal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={onCollectionCreate}
      />
    </Box>
  );
}
