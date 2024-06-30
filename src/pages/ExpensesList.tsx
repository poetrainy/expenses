import { FC, useState } from "react";
import {
  ActionFunctionArgs,
  Params,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import {
  Box,
  Card,
  CardBody,
  Flex,
  SimpleGrid,
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
  getExpensesFilteredCard,
  getExpensesFilteredCash,
  updateExpensesCash,
} from "~/api/expenses";
import { getCardProvider, savePreset } from "~/api/setting";
import { formatDate } from "~/libs/format";
import { LoaderData } from "~/types";
import {
  ExpensesCash,
  ExpensesCashBaseType,
  ExpensesCashType,
} from "~/types/Expenses";
import ExpensesCashOperationModal from "~/components/Modal/ExpensesCashOperationModal";
import ListContainer from "~/components/ListContainer";
import { useSetPageContext } from "~/context/usePageContext";
import { SettingPresetBaseType } from "~/types/Settings";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const currentPath = `/expenses/${params.year}/${params.month}`;

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "update": {
      const id = formData.get("id") as string;
      const content = JSON.parse(
        formData.get("content") as string
      ) as ExpensesCashBaseType;

      try {
        await updateExpensesCash(id, content);

        return redirect(currentPath);
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "delete": {
      const id = formData.get("id") as string;

      try {
        await deleteExpensesCash(id);

        return redirect(currentPath);
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "save_preset": {
      const content = JSON.parse(
        formData.get("content") as string
      ) as SettingPresetBaseType;

      try {
        await savePreset(content);

        return null;
      } catch (e) {
        console.error(e);

        return null;
      }
    }
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: { params: Params<string> }) => {
  const year = params.year!;
  const month = params.month!;

  const filteredCash = await getExpensesFilteredCash(
    year,
    month.length === 1 ? `0${month}` : month
  );
  const filteredCard = await getExpensesFilteredCard(
    year,
    month.length === 1 ? `0${month}` : month
  );

  const cardProvider = await getCardProvider();

  return {
    cash: filteredCash,
    card: filteredCard,
    cardProvider,
    params: { year, month },
  };
};

const ExpensesList: FC = () => {
  const { cash, card, cardProvider, params } = useLoaderData() as LoaderData<
    typeof loader
  >;
  const submit = useSubmit();

  useSetPageContext({ title: "poetrainy-expenses" });

  const [edit, setEdit] = useState<ExpensesCashType | undefined>();

  const onUpdateExpenses = async (
    date: string,
    type: ExpensesCash,
    memo: string,
    amount: number
  ) => {
    if (!edit) {
      return;
    }

    submit(
      {
        intent: "update",
        id: edit.id,
        content: JSON.stringify({
          date,
          type: [type],
          memo,
          amount,
        } satisfies ExpensesCashBaseType),
      },
      {
        method: "POST",
      }
    );
  };

  const onDeleteExpenses = async () => {
    if (!edit) {
      return;
    }

    submit(
      {
        intent: "delete",
        id: edit.id,
      },
      {
        method: "POST",
      }
    );
  };

  const onSavePreset = async (memo: string, amount: number) => {
    submit(
      {
        intent: "save_preset",
        content: JSON.stringify({
          memo,
          amount,
        } satisfies SettingPresetBaseType),
      },
      {
        method: "POST",
      }
    );
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
            fontFamily="amount"
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
            <Tab fontSize="14px">電子決済</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              {cash.length ? (
                <ListContainer>
                  {cash.map((item) => (
                    <Box key={item.id} as="li" w="100%">
                      <Flex
                        as="button"
                        aria-label={`「${item.memo}」の詳細`}
                        onClick={() => setEdit(item)}
                        alignItems="stretch"
                        justifyContent="center"
                        flexDir="column"
                        gap="2px"
                        w="100%"
                        h="60px"
                        p="0 16px"
                        layerStyle="buttonBackgroundTransition.100"
                      >
                        <Text
                          as="span"
                          color="gray.500"
                          fontSize="12px"
                          textAlign="left"
                        >
                          {formatDate(item.date)}
                        </Text>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Text
                            color="gray.600"
                            fontSize="14px"
                            fontWeight="bold"
                            textAlign="left"
                          >
                            {item.memo}
                          </Text>
                          <Text
                            color={
                              item.type.includes("income")
                                ? "green.400"
                                : "gray.700"
                            }
                            fontSize="16px"
                            fontWeight="bold"
                            fontFamily="amount"
                          >
                            {`${item.type.includes("income") ? "+" : ""} ¥${item.amount.toLocaleString()}`}
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </ListContainer>
              ) : (
                <Text>データが登録されていません。</Text>
              )}
            </TabPanel>
            <TabPanel p={0}>
              <SimpleGrid
                columns={2}
                spacing="8px"
                bg="white"
                m="0 -16px"
                p="16px"
                borderY="1px solid"
                borderTopColor="gray.100"
                borderBottomColor="gray.100"
              >
                {cardProvider.map((provider) => (
                  <Flex key={provider.id} as="li" alignItems="stretch" w="100%">
                    <Card
                      as="button"
                      variant="outline"
                      w="100%"
                      justifyContent="space-between"
                      rounded="16px"
                    >
                      <CardBody w="100%" p="8px">
                        <Box
                          role="presentation"
                          w="100%"
                          bg={provider.color}
                          rounded="8px"
                          aspectRatio={1.618 / 1}
                        />
                        <Text textStyle="textHeading">{provider.name}</Text>
                        <Text
                          color="gray.700"
                          fontSize="14px"
                          fontWeight="bold"
                        >
                          {`${card.find(({ cardProvider }) => cardProvider === provider)?.amount.toLocaleString() ?? "（未登録）"}`}
                        </Text>
                      </CardBody>
                    </Card>
                  </Flex>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      {!!edit && (
        <ExpensesCashOperationModal
          variant="edit"
          isOpen={!!edit}
          expenses={edit}
          onClose={() => setEdit(undefined)}
          onSave={(date, type, memo, amount) =>
            onUpdateExpenses(date, type, memo, amount)
          }
          onSavePreset={(memo: string, amount: number) =>
            onSavePreset(memo, amount)
          }
          onDelete={() => onDeleteExpenses()}
        />
      )}
    </>
  );
};

export default ExpensesList;
