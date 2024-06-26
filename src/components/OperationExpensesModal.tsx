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
} from "@chakra-ui/react";
import ModalBase from "~/components/ModalBase";
import { ExpensesCash, ExpensesCashType } from "~/types/Expenses";

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
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (
    date: string,
    type: ExpensesCash,
    purpose: string,
    amount: number
  ) => void;
} & (
  | {
      variant: "new";
      expenses?: undefined;
      onDelete?: undefined;
      isDeleting?: undefined;
    }
  | {
      variant: "edit";
      expenses: ExpensesCashType;
      onDelete: () => void;
      isDeleting: boolean;
    }
);

const OperationExpensesModal: FC<Props> = ({
  variant,
  expenses,
  isOpen,
  isSubmitting,
  isDeleting,
  onClose,
  onSave,
  onDelete,
}) => {
  const [date, setDate] = useState<string>(expenses?.date ?? "");
  const [type, setType] = useState<ExpensesCash>(
    expenses?.type[0] ?? "expenses"
  );
  const [purpose, setPurpose] = useState<string>(expenses?.purpose ?? "");
  const [result, setResult] = useState<string>(
    expenses?.amount ? String(expenses?.amount) : ""
  );
  const [prevIsSubmitting, setPrevIsSubmitting] = useState<boolean>(false);
  const [prevIsDeleting, setPrevIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (
      (prevIsSubmitting && !isSubmitting) ||
      (prevIsDeleting && !isDeleting)
    ) {
      setPrevIsSubmitting(false);
      setDate("");
      setType("expenses");
      setPurpose("");
      setResult("");
    }
  }, [isDeleting, isSubmitting, prevIsDeleting, prevIsSubmitting]);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      size={["full", "3xl"]}
      heading={`収支を${ACTION_MAP[variant]}する`}
      footer={
        <VStack gap="8px" w="100%" maxW="600px" m="auto" p="0 0 16px">
          <Button
            w="100%"
            type="button"
            onClick={() => {
              onSave?.(`${date}`, type, purpose, Number(result));
              setPrevIsSubmitting(true);
            }}
            isLoading={isSubmitting}
            loadingText={`${EXPENSES_AND_INCOME_MAP[type]}を${ACTION_MAP[variant]}する`}
            isDisabled={
              !date.length || !purpose.length || !result.length || !!isDeleting
            }
          >
            {`${EXPENSES_AND_INCOME_MAP[type]}を${ACTION_MAP[variant]}する`}
          </Button>
          {variant === "edit" && (
            <Button
              w="100%"
              type="button"
              variant="ghost"
              colorScheme="red"
              onClick={() => {
                onDelete?.();
                setPrevIsDeleting(true);
              }}
              isDisabled={isSubmitting}
              isLoading={isDeleting}
              loadingText="この記録を削除する"
              h="32px"
              color="red.500"
              fontSize="14px"
              fontWeight="normal"
              bg="transparent"
              transition="color 0.2s"
              _hover={{ color: "red.600", bg: "transparent" }}
              _active={{ color: "red.700", bg: "transparent" }}
              _focus={{ color: "red.700", bg: "transparent" }}
            >
              この記録を削除する
            </Button>
          )}
        </VStack>
      }
    >
      <Tabs isFitted defaultIndex={type === "expenses" ? 0 : 1}>
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            w="80%"
          />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.600" fontWeight="bold">
            内容
          </Text>
          <Input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
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
            bg="gray.200"
            fontSize="20px"
          >
            Clr
          </Center>
          <Text as="span" fontSize="40px" fontFamily="amount">
            <Text as="span" color="gray.500">
              ¥
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
                onClick={() => setResult((p) => `${p}${number}`)}
                w="calc((100% - 4px * 2) / 3)"
                h="56px"
                bg="gray.100"
                fontSize="20px"
              >
                {number}
              </Center>
            ))}
            <Center
              as="button"
              type="button"
              onClick={() => setResult((p) => (p.length ? `${p}0` : p))}
              w="calc((100% - 4px * 2) / 3)"
              h="56px"
              bg="gray.100"
              fontSize="20px"
            >
              0
            </Center>
          </Flex>
          {/* <Arithmetic /> */}
        </Flex>
      </VStack>
    </ModalBase>
  );
};

export default OperationExpensesModal;
