import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Center,
  Flex,
  Icon,
  Text,
  VStack,
  Link as ChakraUILink,
} from "@chakra-ui/react";
import SettingsIcon from "@mui/icons-material/Settings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const NAVIGATION_LINKS = [
  {
    label: "収支",
    icon: AccountBalanceIcon,
    path: "/",
  },
  {
    label: "グラフ",
    icon: LeaderboardIcon,
    path: "/statistics",
  },
  {
    label: "設定",
    icon: SettingsIcon,
    path: "/settings",
  },
];

const Navigation: FC = () => {
  return (
    <Center
      as="nav"
      w="100%"
      maxW="600px"
      bg="white"
      m="auto"
      pos="fixed"
      inset="auto 0 0 0"
      zIndex={10}
      borderTop="1px solid"
      borderTopColor="gray.100"
    >
      <Flex as="ul" justifyContent="space-between" w="100%" p="0 16px">
        {NAVIGATION_LINKS.map((link) => (
          <VStack key={link.path} as="li" alignItems="center" gap="4px">
            <ChakraUILink
              as={RouterLink}
              to={link.path}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
              gap="4px"
              w="80px"
              color="gray.500"
              p="12px 0 24px"
              layerStyle="listItemSingleLine"
            >
              <Icon as={link.icon} boxSize="28px" />
              <Text
                as="span"
                color="gray.500"
                fontSize="11px"
                fontWeight="bold"
              >
                {link.label}
              </Text>
            </ChakraUILink>
          </VStack>
        ))}
      </Flex>
    </Center>
  );
};

export default Navigation;
