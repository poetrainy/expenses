import { FC, useEffect, useState } from "react";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";
import { useSubmitting } from "~/hooks/useSubmitting";
import AmountInputContainer from "~/components/AmountInputContainer";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClick: (memo: string, amount: number) => void;
  prevMemo: string;
  prevAmount: number;
};

const PresetRegisterModal: FC<Props> = ({
  isOpen,
  onClose,
  onClick,
  prevMemo,
  prevAmount,
}) => {
  const { isSubmittingAndLoading } = useSubmitting();
  const [submitCount, setSubmitCount] = useState(0);

  const [memo, setMemo] = useState(prevMemo);
  const [amount, setAmount] = useState(String(prevAmount));

  useEffect(() => {
    if (!isSubmittingAndLoading && !!submitCount) {
      onClose();
    }
  }, [isSubmittingAndLoading, onClose, submitCount]);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading="プリセットに登録"
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
            isDisabled={isSubmittingAndLoading}
            isLoading={isSubmittingAndLoading}
            loadingText="削除"
            onClick={() => {
              onClick(memo, Number(amount));
              setSubmitCount((p) => p + 1);
            }}
            fontSize="14px"
          >
            登録
          </Button>
        </>
      }
    >
      <VStack alignItems="stretch" gap="16px" p={0}>
        <VStack alignItems="stretch" gap="8px" p={0}>
          <Text as="h2" textStyle="textHeading">
            メモ
          </Text>
          <Input
            defaultValue={prevMemo}
            placeholder="e.g. ExamplePay"
            onChange={(e) => setMemo(e.target.value)}
            bg="white"
            rounded="8px"
          />
        </VStack>
        <VStack alignItems="stretch" gap="8px" p={0}>
          <Text as="h2" textStyle="textHeading">
            金額
          </Text>
          <AmountInputContainer size="medium">
            <Input
              type="number"
              defaultValue={prevAmount}
              placeholder="e.g. 1100"
              onChange={(e) =>
                setAmount((p) => (p.length >= 7 ? p : e.target.value))
              }
            />
          </AmountInputContainer>
        </VStack>
      </VStack>
    </ModalBase>
  );
};

export default PresetRegisterModal;
