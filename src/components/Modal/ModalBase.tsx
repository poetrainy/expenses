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
import MenuBase from "~/components/MenuBase";

type Props = ModalProps & {
  heading: string;
  headerLeftAction?: {
    variant: "normal" | "danger";
    label: string;
    onClick: () => void;
  }[];
  footer?: ReactNode;
};

const ModalBase: FC<Props> = ({
  heading,
  headerLeftAction = [],
  footer,
  ...props
}) => (
  <Modal isCentered {...props}>
    <ModalOverlay />
    <ModalContent gap="16px" p="0 16px 16px">
      <ModalHeader
        p="16px 0"
        fontSize="16px"
        pos="relative"
        textAlign="center"
      >
        {!!headerLeftAction.length && (
          <MenuBase
            menu={headerLeftAction}
            m="auto"
            pos="absolute"
            inset="0 auto 0 0"
          />
        )}
        <Text as="span">{heading}</Text>
        <ModalCloseButton m="auto" pos="absolute" inset="0 0 0 auto" />
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
      {footer && (
        <ModalFooter alignItems="stretch" p={0} fontSize="16px">
          {footer}
        </ModalFooter>
      )}
    </ModalContent>
  </Modal>
);

export default ModalBase;
