import { FC } from "react";
import { NavLink } from "react-router-dom";
import {
  Center,
  Flex,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import DescriptionIcon from '@mui/icons-material/Description';
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import SettingsIcon from "@mui/icons-material/Settings";

const NAVIGATION_LINKS = [
  {
    label: "収支",
    icon: DescriptionIcon,
    path: "/expenses",
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
            <NavLink
              to={link.path}
              children={({ isActive }) => (
                <Center
                  flexDir="column"
                  gap="4px"
                  w="80px"
                  color="gray.500"
                  p="12px 0 24px"
                  _hover={{
                    textDecor: "none",
                    ">*": {
                      color: "gray.700",
                      cursor: "pointer",
                    },
                  }}
                  _active={{
                    ">*": {
                      color: "gray.800",
                    },
                  }}
                  _focusVisible={{
                    ">*": {
                      color: "gray.800",
                    },
                  }}
                >
                  <Icon
                    as={link.icon}
                    color={isActive ? "gray.700" : "gray.500"}
                    boxSize="28px"
                    transition="color 0.2s"
                  />
                  <Text
                    as="span"
                    color={isActive ? "gray.700" : "gray.500"}
                    fontSize="10px"
                    fontWeight="bold"
                    transition="color 0.2s"
                  >
                    {link.label}
                  </Text>
                </Center>
              )}
            ></NavLink>
          </VStack>
        ))}
      </Flex>
    </Center>
  );
};

export default Navigation;
