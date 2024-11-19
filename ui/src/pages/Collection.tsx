import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton, useColorMode } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { QueryBuilder } from "../components/query/QueryBuilder";
import { useCollection } from "../hooks/useCollection";
import { useParams } from "react-router-dom";

export function Collection() {
 const { colorMode } = useColorMode();
 const { name } = useParams<{ name: string }>();
 const { documents, loading, error } = useCollection(name!);

 if (loading) return <Box>Loading...</Box>;
 if (error) return <Box>Error: {error.message}</Box>;

 return (
   <Box>
     <Heading mb={6} color={colorMode === 'dark' ? 'white' : 'gray.800'}>
       {name}
     </Heading>
     
     <QueryBuilder onQuery={(query) => console.log(query)} />

     <Box
       bg={colorMode === 'dark' ? 'gray.700' : 'white'}
       borderRadius="lg"
       overflow="hidden"
       boxShadow="sm"
       mt={6}
     >
       <Table>
         <Thead bg={colorMode === 'dark' ? 'gray.600' : 'gray.50'}>
           <Tr>
             <Th color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>ID</Th>
             <Th color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>Created</Th>
             <Th color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>Updated</Th>
             <Th color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>Actions</Th>
           </Tr>
         </Thead>
         <Tbody>
           {documents.map(doc => (
             <Tr key={doc.id}>
               <Td color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                 {doc.id}
               </Td>
               <Td color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                 {new Date(doc.createdAt).toLocaleString()}
               </Td>
               <Td color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                 {new Date(doc.updatedAt).toLocaleString()}
               </Td>
               <Td>
                 <IconButton
                   aria-label="Edit"
                   icon={<EditIcon />}
                   size="sm"
                   mr={2}
                   variant="ghost"
                 />
                 <IconButton
                   aria-label="Delete"
                   icon={<DeleteIcon />}
                   size="sm"
                   colorScheme="red"
                   variant="ghost"
                 />
               </Td>
             </Tr>
           ))}
         </Tbody>
       </Table>
     </Box>
   </Box>
 );
}