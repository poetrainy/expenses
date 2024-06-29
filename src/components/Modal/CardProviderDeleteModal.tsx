import { FC } from "react";
import { Button, Text } from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";
import { useSubmitting } from "~/hooks/useSubmitting";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  cardDataLength: number;
  onClick: () => void;
};

const CardProviderDeleteModal: FC<Props> = ({
  isOpen,
  onClose,
  name,
  cardDataLength,
  onClick,
}) => {
  const { isSubmittingAndLoading } = useSubmitting();

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading={`「${name}」の削除`}
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
            colorScheme="red"
            isDisabled={isSubmittingAndLoading}
            isLoading={isSubmittingAndLoading}
            loadingText="削除"
            onClick={onClick}
            fontSize="14px"
          >
            削除
          </Button>
        </>
      }
    >
      <Text lineHeight="22px" whiteSpace="pre-line">
        {`この情報を削除すると、関連する支出データ（${cardDataLength}件）も全て削除されます。この操作は元に戻せません。\n本当に削除を実行しますか？`}
      </Text>
    </ModalBase>
  );
};

export default CardProviderDeleteModal;
