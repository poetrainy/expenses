import { FC } from "react";
import OriginalModal from "~/components/OriginalModal";
import { ExpensesCashType } from "~/types/Expenses";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  expenses: ExpensesCashType;
};

const ExpensesDetailModal: FC<Props> = ({ isOpen, onClose, expenses }) => {
  if (!expenses) {
    return <></>;
  }

  return (
    <OriginalModal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xs"
      heading="詳細"
    >
      <></>
    </OriginalModal>
  );
};

export default ExpensesDetailModal;
