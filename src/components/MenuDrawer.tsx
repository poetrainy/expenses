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
      label: "すべての記録",
      contents: archives.map((items) => {
        return {
          label: `${items[0]}年${items[1]}月`,
          path: `/${items.join("/")}`,
        };
      }),
    },
    {
      label: "設定",
      contents: [
        {
          label: "プリセット",
          path: "presets",
        },
      ],
    },
  ];

  return (
    <DrawerBase heading="Menu" isOpen={isOpen} onClose={onClose}>
      <VStack gap="24px" alignItems="stretch">
        {MENU_CONTENTS.map(({ label, contents }) => (
          <VStack alignItems="stretch" gap="16px">
            <Text as="p" key={label} color="gray.600" fontWeight="bold">
              {label}
            </Text>
            <VStack as="ul" alignItems="stretch" gap="8px" p={0}>
              {contents.map((item) => (
                <Box as="li" key={item.label}>
                  <ChakraUILink
                    as={RouterLink}
                    to={item.path}
                    state={{ isOpenMenuDrawer: false }}
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
