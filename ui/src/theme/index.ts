// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        variant: 'solid',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'blue.500' : 'blue.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'blue.600' : 'blue.600',
          },
        }),
      },
    },
  },
});