import { Box, VStack, Text, List, ListItem } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { Collection } from '../../types';

interface SidebarProps {
 collections: Collection[];  // Changed from string[]
}

export function Sidebar({ collections }: SidebarProps) {
 const location = useLocation();

 return (
   <Box
     as="nav" 
     width="240px"
     height="100vh"
     borderRight="1px"
     borderColor="gray.200"
     p={4}
   >
     <VStack align="stretch" spacing={4}>
       <List spacing={2}>
         {collections.map(collection => (
           <ListItem key={collection.name}>
             <Link to={`/collections/${collection.name}`}>
               <Text
                 cursor="pointer"
                 _hover={{ color: 'blue.500' }}
                 color={location.pathname === `/collections/${collection.name}` ? 'blue.500' : undefined}
               >
                 {collection.name}
               </Text>
             </Link>
           </ListItem>
         ))}
       </List>
     </VStack>
   </Box>
 );
}