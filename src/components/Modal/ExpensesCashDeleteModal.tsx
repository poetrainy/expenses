import { FC, useEffect, useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";
import { useSubmitting } from "~/hooks/useSubmitting";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
};

const ExpensesCashDeleteModal: FC<Props> = ({ isOpen, onClose, onClick }) => {
  const { isSubmittingAndLoading } = useSubmitting();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isSubmittingAndLoading && isDeleting) {
      onClose();
    }
  }, [isSubmittingAndLoading, isDeleting, onClose]);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      heading="削除"
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
            onClick={() => {
              onClick();
              setIsDeleting(true);
            }}
            fontSize="14px"
          >
            削除
          </Button>
        </>
      }
    >
      <Text lineHeight="22px" whiteSpace="pre-line">
        この記録を削除しますか？
      </Text>
    </ModalBase>
  );
};

export default ExpensesCashDeleteModal;
