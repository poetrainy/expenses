import { FC } from "react";
import {
  ActionFunctionArgs,
  Params,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
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
  useDisclosure,
} from "@chakra-ui/react";
import {
  getExpensesAllCard,
  getExpensesAllCash,
  getExpensesFilteredCard,
  getExpensesFilteredCash,
  saveExpensesCash,
} from "~/api/expenses";
import { EXPENSES_CARD_PROVIDERS } from "~/constants/expenses";
import FloatingButton from "~/components/FloatingButton";
import NewExpensesModal from "~/components/NewExpensesModal";
import { formatDate } from "~/libs/format";
import { LoaderData } from "~/types";
import { ExpensesCash, ExpensesCashBaseType } from "~/types/Expenses";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const content = formData.get("content") as string;

  try {
    await saveExpensesCash(JSON.parse(content) as ExpensesCashBaseType);

    return redirect("/2024/6");
  } catch (e) {
    console.error(e);

    return null;
  }
};

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
  const submit = useSubmit();

  const {
    isOpen: isOpenNewExpensesModal,
    onOpen: onOpenNewExpensesModal,
    onClose: onCloseNewExpensesModal,
  } = useDisclosure();

  const onExpensesSave = (
    date: string,
    type: ExpensesCash,
    purpose: string,
    amount: number
  ) => {
    submit(
      {
        content: JSON.stringify({
          date,
          type: [type],
          purpose,
          amount,
        } satisfies ExpensesCashBaseType),
      },
      {
        method: "POST",
      }
    );

    onCloseNewExpensesModal();
  };

  const total = [
    ...cash.map(({ type, amount }) =>
      type.includes("expenses") ? amount : -amount
    ),
    ...card.map(({ amount }) => amount),
  ].reduce((sum, element) => sum + element, 0);

  return (
    <>
      <VStack alignItems="stretch" gap="32px">
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
          <TabList>
            <Tab fontSize="14px">現金</Tab>
            <Tab fontSize="14px">カード</Tab>
          </TabList>
          <TabPanels mt="16px">
            <TabPanel p={0}>
              {cash.length ? (
                <VStack as="ul" alignItems="stretch" gap="16px">
                  {cash.map((item) => (
                    <Box key={item.id} as="li" w="100%">
                      <Flex
                        as="button"
                        alignItems="center"
                        justifyContent="space-between"
                        w="100%"
                        h="44px"
                      >
                        <Flex flexDir="column" alignItems="left">
                          <Text
                            as="span"
                            color="gray.500"
                            fontSize="12px"
                            textAlign="left"
                          >
                            {formatDate(item.date)}
                          </Text>
                          <Text
                            color="gray.600"
                            fontSize="14px"
                            fontWeight="bold"
                            textAlign="left"
                          >
                            {item.purpose}
                          </Text>
                        </Flex>
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
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text>データが登録されていません。</Text>
              )}
              <FloatingButton onClick={() => onOpenNewExpensesModal()} />
            </TabPanel>
            <TabPanel p={0}>
              <VStack alignItems="stretch" gap="20px">
                {EXPENSES_CARD_PROVIDERS.map((provider) => (
                  <Flex
                    key={provider}
                    alignItems="center"
                    justifyContent="space-between"
                    h="44px"
                  >
                    <Text color="gray.600" fontSize="14px" fontWeight="bold">
                      {provider}
                    </Text>
                    <Text color="gray.700" fontSize="14px" fontWeight="bold">
                      {`${card.find(({ cardProvider }) => cardProvider.includes(provider))?.amount.toLocaleString() ?? "（未登録）"}`}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      <NewExpensesModal
        isOpen={isOpenNewExpensesModal}
        onClose={onCloseNewExpensesModal}
        onSave={(
          date: string,
          type: ExpensesCash,
          purpose: string,
          amount: number
        ) => onExpensesSave(date, type, purpose, amount)}
      />
    </>
  );
};

export default ExpensesList;
