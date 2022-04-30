// Chakra Ui
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
// Hooks
import { AuthProvider } from "../hooks";

const colors = {
  brand: {
    900: "#1a202c",
    800: "#2d3748",
    700: "#4a5267",
  },
};
const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
