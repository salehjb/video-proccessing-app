// Chakra Ui
import { Flex, Heading } from "@chakra-ui/react";

function Header() {
  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="teal.500"
        color="white"
        marginBottom="2rem"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"-0.1rem"}>
            Video Proccessing App
          </Heading>
        </Flex>
      </Flex>
    </>
  );
}

export default Header;
