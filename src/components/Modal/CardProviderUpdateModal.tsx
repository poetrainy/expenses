import { FC, useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";
import { GRAPH_COLORS } from "~/constants/colors";
import { useSubmitting } from "~/hooks/useSubmitting";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClick: (name: string, color: string) => void;
  prevName: string;
  prevColor: string;
};

const CardProviderUpdateModal: FC<Props> = ({
  isOpen,
  onClose,
  onClick,
  prevName,
  prevColor,
}) => {
  const { isSubmittingAndLoading } = useSubmitting();
  const [submitCount, setSubmitCount] = useState(0);

  const [name, setName] = useState<string>(prevName);
  const [color, setColor] = useState<string>(prevColor);

  useEffect(() => {
    if (!isSubmittingAndLoading && !!submitCount) {
      onClose();
      setName("");
      setColor(GRAPH_COLORS[0]);
      setSubmitCount(0);
    }
  }, [isSubmittingAndLoading, submitCount, onClose]);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading="クレジットカード編集"
      footer={
        <>
          <Button
            variant="ghost"
            isDisabled={isSubmittingAndLoading}
            onClick={onClose}
            fontSize="14px"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            isDisabled={!name.length || isSubmittingAndLoading}
            isLoading={isSubmittingAndLoading}
            loadingText="保存"
            onClick={() => {
              onClick(name, color);
              setSubmitCount((p) => p + 1);
            }}
            fontSize="14px"
          >
            保存
          </Button>
        </>
      }
    >
      <VStack alignItems="stretch" gap="16px">
        <VStack alignItems="stretch" gap="4px">
          <Text textStyle="textHeading">クレジットカード名</Text>
          <Input
            value={name}
            placeholder="e.g. 楽天カード"
            isDisabled={isSubmittingAndLoading}
            onChange={(e) => setName(e.target.value)}
          />
        </VStack>
        <VStack alignItems="stretch" gap="4px">
          <Text textStyle="textHeading">グラフの色</Text>
          <Flex gap="4px" p="2px">
            {GRAPH_COLORS.map((graphColor) => (
              <Box
                key={graphColor}
                as="button"
                disabled={isSubmittingAndLoading}
                onClick={() => setColor(graphColor)}
                boxSize="28px"
                minW="28px"
                bg={graphColor}
                p={0}
                rounded="8px"
                border="2px solid white"
                outlineColor="transparent"
                transition="outline-color 0.2s"
                sx={{
                  ...(color === graphColor && {
                    outline: "3px solid",
                    outlineColor: "blue.100",
                  }),
                }}
              />
            ))}
          </Flex>
        </VStack>
      </VStack>
    </ModalBase>
  );
};

export default CardProviderUpdateModal;
