import { FC } from "react";
import { Button, Text } from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";

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
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading={`「${name}」の削除`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button colorScheme="red" onClick={onClick}>
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
