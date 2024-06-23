import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Link as ChakraUILink,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import DrawerBase from "~/components/DrawerBase";

const MENU_SETTINGS = [
  {
    label: "プリセット",
    path: "presets",
  },
];

type Props = {
  archives: number[][];
  isOpen: boolean;
  onClose: () => void;
};

const MenuDrawer: FC<Props> = ({ archives, isOpen, onClose }) => (
  <DrawerBase heading="Expenses" isOpen={isOpen} onClose={onClose}>
    <VStack as="ul" alignItems="stretch" gap="16px" p={0}>
      {archives.map((item) => (
        <Box as="li" key={item.join("/")}>
          <ChakraUILink
            as={RouterLink}
            to={`/${item.join("/")}`}
            onClick={() => onClose()}
          >{`${item[0]}年${item[1]}月`}</ChakraUILink>
        </Box>
      ))}
    </VStack>
    <Spacer />
    <VStack alignItems="stretch">
      <Text as="p" color="gray.600" fontWeight="bold">
        設定
      </Text>
      <VStack as="ul" alignItems="stretch" gap="16px" p={0}>
        {MENU_SETTINGS.map(({ label, path }) => (
          <Box as="li" key={path}>
            <ChakraUILink as={RouterLink} to={path}>
              {label}
            </ChakraUILink>
          </Box>
        ))}
      </VStack>
    </VStack>
  </DrawerBase>
);

export default MenuDrawer;
