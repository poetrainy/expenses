import { Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import ModalBase from "~/components/ModalBase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
};

const TargetAmountModal: FC<Props> = ({ isOpen, onClose, amount }) => {
  const [newAmount, setNewAmount] = useState<number>(amount);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading="目標金額の設定"
      footer={<Button isDisabled={!newAmount}>登録</Button>}
    >
      <VStack alignItems="stretch" gap="8px" p={0}>
        <Text as="span">¥999,999まで入力できます</Text>
        <Flex gap="8px" alignItems="center">
          <Text as="span">¥</Text>
          <Input
            type="number"
            value={newAmount}
            onChange={(e) =>
              e.target.value.length <= 6 && setNewAmount(Number(e.target.value))
            }
            textAlign="right"
          />
        </Flex>
      </VStack>
    </ModalBase>
  );
};

export default TargetAmountModal;
