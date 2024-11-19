import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
   } from "@chakra-ui/react";
   import { useState } from "react";
   import { collectionsApi } from "../../services/api";
   
   interface CreateCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
   }
   
   export function CreateCollectionModal({
    isOpen,
    onClose,
    onCreate,
   }: CreateCollectionModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
   
    const handleSubmit = async () => {
      try {
        setLoading(true);
        await collectionsApi.create(name);
        toast({
          title: "Collection created",
          status: "success",
          duration: 3000,
        });
        onCreate();
        onClose();
        setName("");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create collection';
        toast({
          title: "Error creating collection",
          description: errorMessage,
          status: "error",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
   
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Collection Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
              isDisabled={!name.trim()}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
   }