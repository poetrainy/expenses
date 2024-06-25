import { FC, ReactNode, useState } from "react";
import { Params, useLoaderData, useRevalidator } from "react-router-dom";
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  deleteExpensesCash,
  getExpensesAllCard,
  getExpensesAllCash,
  getExpensesFilteredCard,
  getExpensesFilteredCash,
  updateExpensesCash,
} from "~/api/expenses";
import { EXPENSES_CARD_PROVIDERS } from "~/constants/expenses";
import { formatDate } from "~/libs/format";
import { LoaderData } from "~/types";
import {
  ExpensesCash,
  ExpensesCashBaseType,
  ExpensesCashType,
} from "~/types/Expenses";
import OperationExpensesModal from "~/components/OperationExpensesModal";

const ListWrapper = ({ children }: { children: ReactNode }) => (
  <VStack
    as="ul"
    alignItems="stretch"
    gap={0}
    bg="white"
    m="0 -16px"
    p="8px 0"
    borderY="1px solid"
    borderTopColor="gray.100"
    borderBottomColor="gray.100"
  >
    {children}
  </VStack>
);

// eslint-disable-next-line react-refresh/only-export-components
export const action = async () => {};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: { params: Params<string> }) => {
  const year = params.year!;
  const month = params.month!;

  const allCash = await getExpensesAllCash();
  const filteredCash = await getExpensesFilteredCash(
    year,
    month.length === 1 ? `0${month}` : month
  );

  const allCard = await getExpensesAllCard();
  const filteredCard = await getExpensesFilteredCard(
    year,
    month.length === 1 ? `0${month}` : month
  );

  const archives = [
    ...new Set([
      ...allCash.map(({ date }) => date.substring(0, 7)),
      ...allCard.map(({ date }) => date.substring(0, 7)),
    ]),
  ]
    .sort()
    .map((item) => item.split("-").map((number) => Number(number)));

  return {
    cash: filteredCash,
    card: filteredCard,
    archives,
    params: { year, month },
  };
};

const ExpensesList: FC = () => {
  const { cash, card, params } = useLoaderData() as LoaderData<typeof loader>;
  const revalidator = useRevalidator();

  const [edit, setEdit] = useState<ExpensesCashType | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onExpensesUpdate = async (
    date: string,
    type: ExpensesCash,
    purpose: string,
    amount: number
  ) => {
    if (!edit) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateExpensesCash(edit.id, {
        date,
        type: [type],
        purpose,
        amount,
      } satisfies ExpensesCashBaseType);

      revalidator.revalidate();
      setEdit(undefined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
    setEdit(undefined);
  };

  const onExpensesDelete = async () => {
    if (!edit) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteExpensesCash(edit.id);

      revalidator.revalidate();
      setEdit(undefined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }

    setIsDeleting(false);
    setEdit(undefined);
  };

  const total = [
    ...cash.map(({ type, amount }) =>
      type.includes("expenses") ? amount : -amount
    ),
    ...card.map(({ amount }) => amount),
  ].reduce((sum, element) => sum + element, 0);

  return (
    <>
      <VStack alignItems="stretch" gap="24px">
        <VStack alignItems="center" gap="8px">
          <Text
            color="gray.500"
            fontSize="14px"
            fontWeight="bold"
          >{`${params.year}年${params.month}月の利用金額`}</Text>
          <Text
            color="gray.700"
            fontSize="40px"
            fontWeight="bold"
            lineHeight="40px"
          >{`¥${total.toLocaleString()}`}</Text>
        </VStack>
        <Tabs isFitted variant="enclosed">
          <TabList
            sx={{
              ">button[aria-selected=true]": {
                bg: "white",
              },
              ">button[data-selected]": {
                bg: "white",
              },
            }}
          >
            <Tab fontSize="14px">現金</Tab>
            <Tab fontSize="14px">カード</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              {cash.length ? (
                <ListWrapper>
                  {cash.map((item) => (
                    <Box key={item.id} as="li" w="100%">
                      <Flex
                        as="button"
                        aria-label={`「${item.purpose}」の詳細`}
                        onClick={() => setEdit(item)}
                        alignItems="stretch"
                        justifyContent="center"
                        flexDir="column"
                        gap="2px"
                        w="100%"
                        h="60px"
                        bg="transparent"
                        p="0 16px"
                        transition="background 0.2s"
                        _hover={{ textDecor: "none", bg: "gray.100" }}
                        _active={{ bg: "gray.200" }}
                        _focusVisible={{ bg: "gray.200" }}
                      >
                        <Text
                          as="span"
                          color="gray.500"
                          fontSize="12px"
                          textAlign="left"
                        >
                          {formatDate(item.date)}
                        </Text>
                        <Flex justifyContent="space-between">
                          <Text
                            color="gray.600"
                            fontSize="14px"
                            fontWeight="bold"
                            textAlign="left"
                          >
                            {item.purpose}
                          </Text>
                          <Text
                            color={
                              item.type.includes("income")
                                ? "green.400"
                                : "gray.700"
                            }
                            fontSize="14px"
                            fontWeight="bold"
                          >
                            {`${item.type.includes("income") ? "+" : ""} ¥${item.amount.toLocaleString()}`}
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </ListWrapper>
              ) : (
                <Text>データが登録されていません。</Text>
              )}
            </TabPanel>
            <TabPanel p={0}>
              <ListWrapper>
                {EXPENSES_CARD_PROVIDERS.map((provider) => (
                  <Flex
                    key={provider}
                    as="li"
                    alignItems="center"
                    justifyContent="space-between"
                    h="60px"
                    p="0 16px"
                  >
                    <Text color="gray.600" fontSize="14px" fontWeight="bold">
                      {provider}
                    </Text>
                    <Text color="gray.700" fontSize="14px" fontWeight="bold">
                      {`${card.find(({ cardProvider }) => cardProvider.includes(provider))?.amount.toLocaleString() ?? "（未登録）"}`}
                    </Text>
                  </Flex>
                ))}
              </ListWrapper>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      {edit && (
        <OperationExpensesModal
          variant="edit"
          isOpen={!!edit}
          onClose={() => setEdit(undefined)}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          onSave={(date, type, purpose, amount) =>
            onExpensesUpdate(date, type, purpose, amount)
          }
          onDelete={() => onExpensesDelete()}
          expenses={edit}
        />
      )}
    </>
  );
};

export default ExpensesList;
