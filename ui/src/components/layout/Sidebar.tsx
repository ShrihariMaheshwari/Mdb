import { Collection } from "@/types";
import { Box, VStack, Text, List, ListItem, useColorMode } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar({ collections }: { collections: Collection[] }) {
 const { colorMode } = useColorMode();
 const location = useLocation();

 return (
   <Box
     as="nav"
     w="250px"
     h="100vh" 
     bg={colorMode === 'dark' ? 'gray.800' : 'white'}
     borderRight="1px"
     borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
     p={4}
   >
     <VStack spacing={6} align="stretch">
       <Link to="/">
         <Text
           fontSize="xl"
           fontWeight="bold"
           color={colorMode === 'dark' ? 'white' : 'gray.800'}
           _hover={{ color: 'blue.500' }}
         >
           Collections
         </Text>
       </Link>
       
       <List spacing={2}>
         {collections.map(collection => (
           <ListItem key={collection.name}>
             <Link to={`/collections/${collection.name}`}>
               <Text
                 p={2}
                 borderRadius="md"
                 bg={location.pathname === `/collections/${collection.name}` 
                   ? (colorMode === 'dark' ? 'blue.800' : 'blue.50')
                   : 'transparent'
                 }
                 color={location.pathname === `/collections/${collection.name}`
                   ? (colorMode === 'dark' ? 'blue.200' : 'blue.600')
                   : (colorMode === 'dark' ? 'gray.300' : 'gray.600')
                 }
                 _hover={{
                   bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
                   color: colorMode === 'dark' ? 'blue.200' : 'blue.600'
                 }}
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