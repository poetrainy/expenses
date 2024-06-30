import { FC, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import ModalBase from "~/components/Modal/ModalBase";
import { ExpensesCashlessType, ExpensesCash } from "~/types/Expenses";
import { useSubmitting } from "~/hooks/useSubmitting";
import ExpensesAmountInput from "~/components/Modal/ExpensesAmountInput";
import { CashlessTargetType } from "~/types/Settings";

type Props = {
  expenses?: ExpensesCashlessType;
  date: { year: string; month: string };
  cashless?: CashlessTargetType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: ExpensesCash, amount: number) => void;
};

const ExpensesCashlessUpdateModal: FC<Props> = ({
  expenses,
  date,
  cashless,
  isOpen,
  onClose,
  onSave,
}) => {
  const { isSubmittingAndLoading } = useSubmitting();
  const [submitCount, setSubmitCount] = useState(0);

  const [type, setType] = useState<ExpensesCash>(
    expenses?.category[0] ?? "expenses"
  );
  const [result, setResult] = useState<number>(expenses?.amount ?? 0);

  const LIST = [
    { label: "利用期間", value: `${date.year}年${date.month}月` },
    { label: "種別", value: cashless?.name },
  ];

  useEffect(() => {
    if (!isSubmittingAndLoading && !!submitCount) {
      onClose();
      setType("expenses");
      setResult(0);
      setSubmitCount(0);
    }
  }, [isSubmittingAndLoading, onClose, submitCount]);

  return (
    <>
      <ModalBase
        isOpen={isOpen}
        onClose={onClose}
        size={["full", "3xl"]}
        heading="電子決済額を編集"
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
                onSave?.(type, Number(result));
              }}
              isLoading={isSubmittingAndLoading && !!submitCount}
              loadingText="電子決済額を保存する"
              isDisabled={!result || isSubmittingAndLoading}
              h="56px"
            >
              電子決済額を保存する
            </Button>
          </VStack>
        }
      >
        <Tabs
          isFitted
          defaultIndex={expenses?.category.includes("income") ? 1 : 0}
        >
          <TabList>
            <Tab onClick={() => setType("expenses")}>支出</Tab>
            <Tab onClick={() => setType("income")}>収入</Tab>
          </TabList>
        </Tabs>
        <VStack alignItems="stretch">
          {LIST.map(({ label, value }) => (
            <Flex
              key={label}
              justifyContent="space-between"
              alignItems="center"
              h="40px"
            >
              <Text as="span" color="gray.600" fontWeight="bold">
                {label}
              </Text>
              <Text as="span" fontSize="16px">
                {value}
              </Text>
            </Flex>
          ))}
        </VStack>
        <ExpensesAmountInput
          type={type}
          defaultValue={expenses?.amount}
          onChange={(amount) => setResult(amount)}
        />
      </ModalBase>
    </>
  );
};

export default ExpensesCashlessUpdateModal;
