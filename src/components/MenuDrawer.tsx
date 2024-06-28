import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link as ChakraUILink, VStack } from "@chakra-ui/react";
import DrawerBase from "~/components/DrawerBase";

type Props = {
  archives: number[][];
  isOpen: boolean;
  onClose: () => void;
};

const MenuDrawer: FC<Props> = ({ archives, isOpen, onClose }) => {
  const MENU_CONTENTS = [
    {
      heading: "すべての記録",
      contents: archives.map((items) => {
        return {
          label: `${items[0]}年${items[1]}月`,
          path: `/expenses/${items.join("/")}`,
        };
      }),
    },
  ];

  return (
    <DrawerBase heading="Menu" isOpen={isOpen} onClose={onClose}>
      <VStack gap="24px" alignItems="stretch">
        {MENU_CONTENTS.map(({ heading, contents }) => (
          <VStack key={heading} alignItems="stretch">
            <VStack as="ul" alignItems="stretch" gap={0} p={0}>
              {contents.map((item) => (
                <Box as="li" key={item.label} w="100%">
                  <ChakraUILink
                    as={RouterLink}
                    to={item.path}
                    state={{ isOpenMenuDrawer: false }}
                    display="flex"
                    alignItems="center"
                    w="100%"
                    h="48px"
                    p="0 16px"
                    layerStyle="buttonBackgroundTransition.100"
                  >
                    {item.label}
                  </ChakraUILink>
                </Box>
              ))}
            </VStack>
          </VStack>
        ))}
      </VStack>
    </DrawerBase>
  );
};

export default MenuDrawer;
