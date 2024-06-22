import { FC } from "react";
import { Center, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

type Props = {
  onClick: () => void;
};

const FloatingButton: FC<Props> = ({ onClick }) => (
  <Center
    as={IconButton}
    icon={<AddIcon boxSize="32px" />}
    onClick={onClick}
    boxSize="72px"
    p={0}
    pos="fixed"
    inset="auto 32px 88px auto"
    rounded="full"
  />
);

export default FloatingButton;
