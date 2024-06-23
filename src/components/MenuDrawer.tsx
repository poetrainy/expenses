import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link as ChakraUILink, Text, VStack } from "@chakra-ui/react";
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
          path: `/${items.join("/")}`,
        };
      }),
    },
    {
      heading: "設定",
      contents: [
        {
          label: "プリセット",
          path: "presets",
        },
        {
          label: "収支の連続登録",
          path: "",
        },
      ],
    },
  ];

  return (
    <DrawerBase heading="Menu" isOpen={isOpen} onClose={onClose}>
      <VStack gap="24px" alignItems="stretch">
        {MENU_CONTENTS.map(({ heading, contents }) => (
          <VStack key={heading} alignItems="stretch">
            <Text
              as="p"
              key={heading}
              color="gray.600"
              p="0 16px"
              fontSize="13px"
              fontWeight="bold"
              lineHeight="13px"
            >
              {heading}
            </Text>
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
                    bg="white"
                    p="0 16px"
                    transform="background 0.2s"
                    _hover={{ textDecor: "none", bg: "gray.100" }}
                    _active={{ bg: "gray.200" }}
                    _focusVisible={{ bg: "gray.300" }}
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
