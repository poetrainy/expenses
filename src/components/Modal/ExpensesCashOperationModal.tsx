import { FC, useEffect, useState } from "react";
import {
  Button,
  Center,
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
import { ExpensesCash, ExpensesCashType } from "~/types/Expenses";
import { useSubmitting } from "~/hooks/useSubmitting";

const NUMBERS = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
const ARITHMETICS: string[] = ["/", "*", "-", "+"];

export const Arithmetic = () => (
  <VStack gap="4px" p={0} w="calc(100% * 0.2 + 2px)">
    {ARITHMETICS.map((arithmetic) => (
      <Center
        as="button"
        type="button"
        key={arithmetic}
        w="100%"
        h="calc(100% * 4 * 2 / 3)"
        bg="gray.200"
        fontSize="20px"
      >
        {arithmetic}
      </Center>
    ))}
  </VStack>
);

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
  const [result, setResult] = useState<string>(
    expenses?.amount ? String(expenses?.amount) : ""
  );

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
      setResult("");
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
                !result.length ||
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
        <VStack gap="16px" w="100%">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            h="48px"
          >
            <Center
              as="button"
              type="button"
              onClick={() => setResult("")}
              w="calc(((100% * 0.8 + 2px) - 4px * 3) / 3)"
              h="48px"
              fontSize="20px"
              fontFamily="amount"
              transition="background 0.2s"
              layerStyle="buttonBackgroundTransition.300"
            >
              Clr
            </Center>
            <Text as="span" fontSize="40px" fontFamily="amount">
              <Text as="span" color="gray.500">
                {`${type === "income" ? "+ " : ""}¥`}
              </Text>
              <Text
                as="span"
                sx={{
                  ...(type === "income" && {
                    color: "green.400",
                  }),
                }}
              >
                {Number(result.length ? result : "0").toLocaleString()}
              </Text>
            </Text>
          </Flex>
          <Flex gap="4px" w="100%">
            <Flex
              flexWrap="wrap"
              gap="4px"
              w="100%"
              // w="calc(100% * 0.8 + 2px)"
            >
              {NUMBERS.map((number) => (
                <Center
                  as="button"
                  type="button"
                  key={number}
                  onClick={() =>
                    setResult((p) => (p.length >= 7 ? p : `${p}${number}`))
                  }
                  w="calc((100% - 4px * 2) / 3)"
                  h="56px"
                  fontSize="22px"
                  fontFamily="amount"
                  layerStyle="buttonBackgroundTransition.200"
                >
                  {number}
                </Center>
              ))}
              <Center
                as="button"
                type="button"
                onClick={() =>
                  setResult((p) => (p.length >= 7 ? p : p.length ? `${p}0` : p))
                }
                w="calc((100% - 4px * 2) / 3)"
                h="56px"
                fontSize="22px"
                fontFamily="amount"
                layerStyle="buttonBackgroundTransition.200"
              >
                0
              </Center>
            </Flex>
            {/* <Arithmetic /> */}
          </Flex>
        </VStack>
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
