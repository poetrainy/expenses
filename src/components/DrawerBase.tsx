import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerProps,
} from "@chakra-ui/react";
import { FC } from "react";

type Props = DrawerProps & {
  heading: string;
};

const DrawerBase: FC<Props> = ({ heading, ...props }) => (
  <Drawer placement="left" {...props}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader p="16px" fontSize="18px">{heading}</DrawerHeader>
      <DrawerBody
        display="flex"
        flexDir="column"
        alignItems="stretch"
        gap="8px"
        p={0}
      >
        {props.children}
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default DrawerBase;
