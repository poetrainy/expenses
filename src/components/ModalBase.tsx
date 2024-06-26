import { FC, ReactNode } from "react";
import {
  ModalBody,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalProps,
  ModalHeader,
  Text,
  ModalOverlay,
  ModalFooter,
} from "@chakra-ui/react";

type Props = ModalProps & {
  heading: string;
  footer?: ReactNode;
};

const ModalBase: FC<Props> = ({ heading, footer, ...props }) => (
  <Modal isCentered {...props}>
    <ModalOverlay />
    <ModalContent gap="16px" p="0 16px 16px">
      <ModalHeader p="16px 0" fontSize="18px" textAlign="center">
        <Text as="span">{heading}</Text>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody
        display="flex"
        flexDir="column"
        gap="24px"
        w="100%"
        maxW="600px"
        m="auto"
        p={0}
        pos="relative"
      >
        {props.children}
      </ModalBody>
      {footer && <ModalFooter alignItems="stretch" p={0}>{footer}</ModalFooter>}
    </ModalContent>
  </Modal>
);

export default ModalBase;
