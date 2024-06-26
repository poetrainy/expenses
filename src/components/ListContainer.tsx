import { FC, ReactNode } from "react";
import { VStack } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

const ListContainer: FC<Props> = ({ children }) => (
  <VStack
    as="ul"
    alignItems="stretch"
    gap={0}
    bg="white"
    m="0 -16px"
    p="8px 0"
    borderY="1px solid"
    borderTopColor="gray.100"
    borderBottomColor="gray.100"
  >
    {children}
  </VStack>
);

export default ListContainer;
