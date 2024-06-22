import { FC } from "react";
import {
  ModalBody,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalProps,
  ModalHeader,
  Text,
  ModalOverlay,
} from "@chakra-ui/react";

type Props = ModalProps & {
  heading: string;
};

const OriginalModal: FC<Props> = ({ heading,...props }) => (
  <Modal isCentered {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader
        fontSize="18px"
        textAlign="center"
      >
        <Text as="span">{heading}</Text>
        <ModalCloseButton
        />
      </ModalHeader>
      <ModalBody
        display="flex"
        flexDir="column"
        gap="24px"
        w="100%"
        maxW="600px"
        m="auto"
        p="0 16px 16px"
        pos="relative"
      >
        {props.children}
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default OriginalModal;
