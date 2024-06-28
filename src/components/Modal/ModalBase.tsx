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
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  headerLeftAction,
  footer,
  ...props
}) => (
  <Modal isCentered {...props}>
    <ModalOverlay />
    <ModalContent gap="16px" p="0 16px 16px">
      <ModalHeader p="16px 0" fontSize="18px" textAlign="center" pos="relative">
        {headerLeftAction?.length && (
          <Menu autoSelect={false}>
            <MenuButton
              as={IconButton}
              icon={<Icon as={MoreVertIcon} boxSize="20px" />}
              aria-label="メニューを開く"
              variant="ghost"
              boxSize="32px"
              minW="32px"
              m="auto"
              pos="absolute"
              inset="0 auto 0 0"
            />
            <MenuList rounded="16px" overflow="hidden">
              {headerLeftAction.map(({ variant, label, onClick }) => (
                <MenuItem
                  key={label}
                  as={Button}
                  variant="ghost"
                  colorScheme={variant === "danger" ? "red" : undefined}
                  onClick={onClick}
                  justifyContent="flex-start"
                  h="44px"
                  fontSize="14px"
                  fontWeight="normal"
                  rounded="0"
                  {...(variant === "danger" && { color: "red.500" })}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
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
        <ModalFooter alignItems="stretch" p={0}>
          {footer}
        </ModalFooter>
      )}
    </ModalContent>
  </Modal>
);

export default ModalBase;
