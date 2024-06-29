import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Flex, Link as ChakraUILink, Text, VStack } from "@chakra-ui/react";
import ListContainer from "~/components/ListContainer";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useSetPageContext } from "~/context/usePageContext";

const SETTING_LINKS = [
  {
    heading: "カスタマイズ",
    items: [
      {
        label: "目標金額",
        path: "targetAmount",
      },
      {
        label: "プリセット",
        path: "presets",
      },
      {
        label: "電子決済リスト",
        path: "card",
      },
    ],
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  return {};
};

const Settings: FC = () => {
  useSetPageContext({ title: "設定" });

  return (
    <VStack
      as="ul"
      alignItems="stretch"
      gap="16px"
      m="-24px -16px"
      p="24px 16px"
    >
      {SETTING_LINKS.map(({ heading, items }) => (
        <VStack as="li" key={heading} alignItems="stretch" gap="6px" p={0}>
          <Text textStyle="textHeading">{heading}</Text>
          <ListContainer>
            {items.map(({ label, path }) => (
              <Flex key={label} as="li" w="100%">
                <ChakraUILink
                  as={RouterLink}
                  to={path}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  w="100%"
                  h="56px"
                  p="0 16px"
                  layerStyle="buttonBackgroundTransition.100"
                >
                  <Text as="span">{label}</Text>
                  <ChevronRightIcon color="gray.600" boxSize="24px" />
                </ChakraUILink>
              </Flex>
            ))}
          </ListContainer>
        </VStack>
      ))}
    </VStack>
  );
};

export default Settings;
