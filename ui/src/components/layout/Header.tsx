import { Flex, Heading, IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export function Header() {
 const { colorMode, toggleColorMode } = useColorMode();

 return (
   <Flex
     as="header"
     align="center"
     justify="space-between"
     p={4}
     borderBottom="1px"
     borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
     bg={colorMode === 'dark' ? 'gray.900' : 'white'}
   >
     <Heading size="md" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
       MDB Dashboard
     </Heading>
     <IconButton
       aria-label="Toggle color mode"
       icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
       onClick={toggleColorMode}
       variant="ghost"
     />
   </Flex>
 );
}