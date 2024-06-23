import { FC } from "react";
import ModalBase from "~/components/ModalBase";
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
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xs"
      heading="詳細"
    >
      <></>
    </ModalBase>
  );
};

export default ExpensesDetailModal;
