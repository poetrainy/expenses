import { FC, ReactNode } from "react";
import { VStack } from "@chakra-ui/react";
import Header from "~/components/Header";

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
    p="72px 16px 40px"
  >
    <Header archives={archives} />
    {children}
  </VStack>
);

export default Layout;
