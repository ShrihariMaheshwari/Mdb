// src/components/documents/EditDocumentModal.tsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    useToast
   } from '@chakra-ui/react';
   import { useState } from 'react';
   import { Document } from '../../types';
   
   interface EditDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document;
    onEdit: (id: string, data: Partial<Document>) => Promise<void>;
   }
   
   export function EditDocumentModal({
    isOpen,
    onClose,
    document,
    onEdit
   }: EditDocumentModalProps) {
    const [formData, setFormData] = useState<Record<string, any>>(() => {
      const data = { ...document };
      // Make properties optional before deletion
      const editableData: Partial<typeof data> = { ...data };
      delete editableData.id;
      delete editableData.createdAt;
      delete editableData.updatedAt;
      return editableData;
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
   
    const handleSubmit = async () => {
      try {
        setLoading(true);
        await onEdit(document.id, formData);
        toast({
          title: 'Document updated',
          status: 'success',
          duration: 3000
        });
        onClose();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        toast({
          title: 'Error updating document',
          description: errorMessage,
          status: 'error',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };
   
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {Object.entries(formData).map(([key, value]) => (
                <FormControl key={key}>
                  <FormLabel>{key}</FormLabel>
                  <Input
                    value={value}
                    onChange={(e) => 
                      setFormData(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))
                    }
                  />
                </FormControl>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
   }