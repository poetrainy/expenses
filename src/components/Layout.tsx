import { FC, ReactNode } from "react";
import { VStack } from "@chakra-ui/react";
import Header from "~/components/Header";
import Navigation from "~/components/Navigation";

type Props = {
  children: ReactNode;
  archives: number[][];
};

const Layout: FC<Props> = ({ children, archives }) => (
  <VStack
    alignItems="stretch"
    gap="24px"
    maxW="600px"
    m="0 auto"
    p="80px 16px 96px"
  >
    <Header archives={archives} />
    {children}
    <Navigation />
  </VStack>
);

export default Layout;
