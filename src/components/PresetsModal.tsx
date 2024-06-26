import { Input } from "@chakra-ui/react";
import { FC } from "react";
import ModalBase from "~/components/ModalBase";
import { SettingPresetsType } from "~/types/Expenses";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  presets: SettingPresetsType[];
};

const PresetsModal: FC<Props> = ({ isOpen, onClose, presets }) => {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading="プリセットの設定"
    >
      {presets.map((item) => (
        <Input key={item.id}></Input>
      ))}
    </ModalBase>
  );
};

export default PresetsModal;
