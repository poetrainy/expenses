import { FC } from "react";
import { StackProps, VStack } from "@chakra-ui/react";

const ListContainer: FC<StackProps> = (props) => (
  <VStack
    as={props.as ?? "ul"}
    alignItems="stretch"
    gap={0}
    bg="white"
    m="0 -16px"
    p="8px 0"
    borderY="1px solid"
    borderTopColor="gray.100"
    borderBottomColor="gray.100"
    {...props}
  >
    {props.children}
  </VStack>
);

export default ListContainer;
