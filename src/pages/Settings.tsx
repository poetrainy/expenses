import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { getPresets, getTargetAmount } from "~/api/expenses";
import { LoaderData } from "~/types";
import ListContainer from "~/components/ListContainer";
import PresetsModal from "~/components/PresetsModal";
import TargetAmountModal from "~/components/TargetAmountModal";
import { ChevronRightIcon } from "@chakra-ui/icons";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const targetAmount = await getTargetAmount();
  const presets = await getPresets();

  return { targetAmount, presets };
};

const Settings: FC = () => {
  const { targetAmount, presets } = useLoaderData() as LoaderData<
    typeof loader
  >;

  const {
    isOpen: isOpenTargetAmountModal,
    onOpen: onOpenTargetAmountModal,
    onClose: onCloseTargetAmountModal,
  } = useDisclosure();

  const {
    isOpen: isOpenPresetsModal,
    onOpen: onOpenPresetsModal,
    onClose: onClosePresetsModal,
  } = useDisclosure();

  const LIST = [
    {
      heading: "カスタマイズ",
      items: [
        {
          label: "目標金額",
          onClick: () => onOpenTargetAmountModal(),
        },
        {
          label: "プリセット",
          onClick: () => onOpenPresetsModal(),
        },
      ],
    },
  ];

  return (
    <>
      <VStack
        as="ul"
        alignItems="stretch"
        gap="16px"
        m="-24px -16px"
        p="24px 16px"
      >
        {LIST.map(({ heading, items }) => (
          <VStack as="li" key={heading} alignItems="stretch" gap="6px" p={0}>
            <Text color="gray.500" fontWeight="bold" fontSize="12px">
              {heading}
            </Text>
            <ListContainer>
              {items.map(({ label, onClick }) => (
                <Flex key={label} as="li" w="100%">
                  <Flex
                    as="button"
                    onClick={onClick}
                    alignItems="center"
                    justifyContent="space-between"
                    w="100%"
                    h="48px"
                    p="0 16px"
                    layerStyle="buttonBackgroundTransition.100"
                  >
                    <Text as="span">{label}</Text>
                    <ChevronRightIcon color="gray.500" boxSize="24px" />
                  </Flex>
                </Flex>
              ))}
            </ListContainer>
          </VStack>
        ))}
      </VStack>
      <TargetAmountModal
        isOpen={isOpenTargetAmountModal}
        onClose={onCloseTargetAmountModal}
        amount={targetAmount}
      />
      <PresetsModal
        isOpen={isOpenPresetsModal}
        onClose={onClosePresetsModal}
        presets={presets}
      />
    </>
  );
};

export default Settings;
