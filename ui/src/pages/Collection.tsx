// src/pages/Collection.tsx
import { useParams } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import { DocumentsList } from '../components/documents/DocumentList'; 
import { QueryBuilder } from '../components/query/QueryBuilder';
import { useCollection } from '../hooks/useCollection'; 
import { QueryFilter } from '../types';

export function Collection() {
 const { name } = useParams<{ name: string }>();
 const { 
   documents, 
   loading, 
   error,  
   updateDocument, 
   deleteDocument,
   queryDocuments 
 } = useCollection(name!);

 const handleQuery = async (filter: QueryFilter) => {
   try {
     await queryDocuments(filter);
   } catch (err) {
     console.error('Query error:', err);
   }
 };

 if (loading) return <Box>Loading...</Box>;
 if (error) return <Box>Error: {error.message}</Box>;

 return (
   <Box>
     <Heading mb={6}>{name}</Heading>
     <QueryBuilder onQuery={handleQuery} />
     <DocumentsList
       documents={documents}
       onEdit={updateDocument}
       onDelete={deleteDocument}
     />
   </Box>
 );
}