import { FC, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";
import PresetRegisterModal from "~/components/Modal/PresetRegisterModal";
import ExpensesCashDeleteModal from "~/components/Modal/ExpensesCashDeleteModal";
import ExpensesAmountInput from "~/components/Modal/ExpensesAmountInput";
import { ExpensesCash, ExpensesCashType } from "~/types/Expenses";
import { useSubmitting } from "~/hooks/useSubmitting";

type ModalVariant = "new" | "edit";

const ACTION_MAP: Record<ModalVariant, string> = {
  new: "登録",
  edit: "編集",
};

const EXPENSES_AND_INCOME_MAP: Record<ExpensesCash, string> = {
  expenses: "支出",
  income: "収入",
};

type Props = {
  variant: ModalVariant;
  expenses?: ExpensesCashType;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSave: (
    date: string,
    type: ExpensesCash,
    memo: string,
    amount: number
  ) => void;
  onSavePreset?: (memo: string, amount: number) => void;
  onDelete?: () => void;
};

const ExpensesCashOperationModal: FC<Props> = ({
  variant,
  expenses,
  isOpen,
  isSubmitting,
  onClose,
  onSave,
  onSavePreset,
  onDelete,
}) => {
  const { isSubmittingAndLoading } = useSubmitting();
  const [submitCount, setSubmitCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [date, setDate] = useState<string>(expenses?.date.split("T")[0] ?? "");
  const [type, setType] = useState<ExpensesCash>(
    expenses?.type[0] ?? "expenses"
  );
  const [memo, setMemo] = useState<string>(expenses?.memo ?? "");
  const [result, setResult] = useState<number>(expenses?.amount ?? 0);

  const {
    isOpen: isOpenPresetRegisterModal,
    onOpen: onOpenPresetRegisterModal,
    onClose: onClosePresetRegisterModal,
  } = useDisclosure();

  const {
    isOpen: isOpenExpensesCashDeleteModal,
    onOpen: onOpenExpensesCashDeleteModal,
    onClose: onCloseExpensesCashDeleteModal,
  } = useDisclosure();

  useEffect(() => {
    if (!isSubmittingAndLoading && !isSubmitting && !!submitCount) {
      onClose();
      setDate("");
      setType("expenses");
      setMemo("");
      setResult(0);
      setSubmitCount(0);
    }
  }, [isSubmitting, isSubmittingAndLoading, onClose, submitCount]);

  return (
    <>
      <ModalBase
        isOpen={isOpen}
        onClose={onClose}
        size={["full", "3xl"]}
        heading={`収支を${ACTION_MAP[variant]}`}
        headerLeftAction={
          variant === "edit"
            ? [
                {
                  variant: "normal",
                  label: "プリセットに登録",
                  onClick: () => onOpenPresetRegisterModal(),
                },
              ]
            : undefined
        }
        footer={
          <VStack
            alignItems="stretch"
            gap="8px"
            w="100%"
            maxW="600px"
            m="auto"
            p="0 0 16px"
          >
            <Button
              type="button"
              onClick={() => {
                setSubmitCount((p) => p + 1);
                onSave?.(`${date}`, type, memo, Number(result));
              }}
              isLoading={
                (isSubmittingAndLoading || isSubmitting) &&
                !!submitCount &&
                !isDeleting
              }
              loadingText={`${EXPENSES_AND_INCOME_MAP[type]}を${ACTION_MAP[variant]}する`}
              isDisabled={
                !date.length ||
                !memo.length ||
                !result ||
                isSubmittingAndLoading ||
                isSubmitting
              }
              h="56px"
            >
              {`${EXPENSES_AND_INCOME_MAP[type]}を${ACTION_MAP[variant]}する`}
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                colorScheme="red"
                isDisabled={isSubmittingAndLoading || isSubmitting}
                onClick={() => onOpenExpensesCashDeleteModal()}
                h="fit-content"
                p="8px 16px"
                fontSize="14px"
              >
                記録を削除する
              </Button>
            )}
          </VStack>
        }
      >
        <Tabs isFitted defaultIndex={expenses?.type.includes("income") ? 1 : 0}>
          <TabList>
            <Tab onClick={() => setType("expenses")}>支出</Tab>
            <Tab onClick={() => setType("income")}>収入</Tab>
          </TabList>
        </Tabs>
        <VStack alignItems="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="gray.600" fontWeight="bold">
              日付
            </Text>
            <Input
              type="date"
              defaultValue={expenses?.date.split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              w="80%"
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="gray.600" fontWeight="bold">
              メモ
            </Text>
            <Input
              type="text"
              defaultValue={expenses?.memo}
              onChange={(e) => setMemo(e.target.value)}
              w="80%"
              placeholder="e.g. やまもとクリニック"
            />
          </Flex>
        </VStack>
        <ExpensesAmountInput
          type={type}
          defaultValue={expenses?.amount}
          onChange={(amount) => setResult(amount)}
        />
      </ModalBase>
      {onSavePreset && (
        <PresetRegisterModal
          isOpen={isOpenPresetRegisterModal}
          onClose={onClosePresetRegisterModal}
          prevMemo={memo}
          prevAmount={Number(result)}
          onClick={onSavePreset}
        />
      )}
      <ExpensesCashDeleteModal
        isOpen={isOpenExpensesCashDeleteModal}
        onClose={onCloseExpensesCashDeleteModal}
        onClick={() => {
          onDelete?.();
          setIsDeleting(true);
          setSubmitCount((p) => p + 1);
        }}
      />
    </>
  );
};

export default ExpensesCashOperationModal;
