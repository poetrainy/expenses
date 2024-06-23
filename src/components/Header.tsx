import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Center, Heading, IconButton, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import MenuDrawer from "~/components/MenuDrawer";

type Props = {
  archives: number[][];
};

const Header: FC<Props> = ({ archives }) => {
  const { state } = useLocation();

  const {
    isOpen: isOpenMenuDrawer,
    onOpen: onOpenMenuDrawer,
    onClose: onCloseMenuDrawer,
  } = useDisclosure();

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.isOpenMenuDrawer === false) {
      onCloseMenuDrawer();
    }
  }, [onCloseMenuDrawer, state]);

  return (
    <>
      <Center w="100%" h="64px" bg="white" pos="fixed" inset="0 0 auto 0" zIndex={10}>
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          aria-label="メニューを開く"
          onClick={() => onOpenMenuDrawer()}
          m="auto"
          pos="absolute"
          inset="0 auto 0 16px"
        />
        <Heading as="h1" fontSize="16px">
          poetrainy-expenses
        </Heading>
      </Center>
      <MenuDrawer
        isOpen={isOpenMenuDrawer}
        onClose={onCloseMenuDrawer}
        archives={archives}
      />
    </>
  );
};

export default Header;
