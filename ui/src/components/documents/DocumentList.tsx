import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Document } from "../../types";
import { EditDocumentModal } from "./EditDocumentModal";
import { useState } from "react";

interface DocumentsListProps {
  documents: Document[];
  onEdit: (id: string, data: Partial<Document>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function DocumentsList({
  documents,
  onEdit,
  onDelete,
}: DocumentsListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleEdit = (doc: Document) => {
    setSelectedDoc(doc);
    onOpen();
  };

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Created</Th>
            <Th>Updated</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((doc) => (
            <Tr key={doc.id}>
              <Td>{doc.id}</Td>
              <Td>{new Date(doc.createdAt).toLocaleString()}</Td>
              <Td>{new Date(doc.updatedAt).toLocaleString()}</Td>
              <Td>
                <IconButton
                  aria-label="Edit document"
                  icon={<EditIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => handleEdit(doc)}
                />
                <IconButton
                  aria-label="Delete document"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(doc.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedDoc && (
        <EditDocumentModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedDoc(null);
          }}
          document={selectedDoc}
          onEdit={onEdit}
        />
      )}
    </Box>
  );
}
