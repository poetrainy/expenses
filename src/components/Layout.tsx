import { FC, ReactNode } from "react";
import { VStack } from "@chakra-ui/react";

const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <VStack
    alignItems="stretch"
    gap="24px"
    maxW="600px"
    m="0 auto"
    p="16px 16px 40px"
  >
    {children}
  </VStack>
);

export default Layout;
