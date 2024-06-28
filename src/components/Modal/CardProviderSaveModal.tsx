import { FC, useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClick: (value: string) => void;
};

const CardProviderSaveModal: FC<Props> = ({ isOpen, onClose, onClick }) => {
  const [name, setName] = useState<string>("");

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading="新しいカード会社を登録"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            isDisabled={!name.length}
            onClick={() => {
              onClick(name);
              setName("");
            }}
          >
            登録
          </Button>
        </>
      }
    >
      <Input
        value={name}
        placeholder="e.g. 楽天カード"
        onChange={(e) => setName(e.target.value)}
      />
    </ModalBase>
  );
};

export default CardProviderSaveModal;
