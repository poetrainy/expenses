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
  Flex,
  SimpleGrid,
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
  deleteExpensesCash,
  getExpensesFilteredCard,
  getExpensesFilteredCash,
  saveExpensesCard,
  updateExpensesCard,
  updateExpensesCash,
} from "~/api/expenses";
import { getCardProvider, savePreset } from "~/api/setting";
import { formatDate } from "~/libs/format";
import { LoaderData } from "~/types";
import {
  ExpensesCardSaveType,
  ExpensesCardType,
  ExpensesCash,
  ExpensesCashBaseType,
  ExpensesCashType,
} from "~/types/Expenses";
import ExpensesCashOperationModal from "~/components/Modal/ExpensesCashOperationModal";
import ListContainer from "~/components/ListContainer";
import { useSetPageContext } from "~/context/usePageContext";
import {
  SettingCardProviderType,
  SettingPresetBaseType,
} from "~/types/Settings";
import ExpensesCardEditModal from "~/components/Modal/ExpensesCardUpdateModal";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const currentPath = `/expenses/${params.year}/${params.month}`;

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "cash_update": {
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

    case "cash_delete": {
      const id = formData.get("id") as string;

      try {
        await deleteExpensesCash(id);

        return redirect(currentPath);
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "card_save": {
      const content = JSON.parse(
        formData.get("content") as string
      ) as ExpensesCardSaveType;

      try {
        await saveExpensesCard(content);

        return redirect(currentPath);
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "card_update": {
      const id = formData.get("id") as string;
      const content = JSON.parse(
        formData.get("content") as string
      ) as ExpensesCardSaveType;

      try {
        await updateExpensesCard(id, content);

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

  const [edit, setEdit] = useState<ExpensesCashType>();
  const [editCardVariant, setEditCardVariant] = useState<"new" | "edit">("new");
  const [editCard, setEditCard] = useState<ExpensesCardType>();
  const [editCardProvider, setEditCardProvider] =
    useState<SettingCardProviderType>();

  const {
    isOpen: isOpenExpensesCardUpdateModal,
    onOpen: onOpenExpensesCardUpdateModal,
    onClose: onCloseExpensesCardUpdateModal,
  } = useDisclosure();

  const onUpdateCash = async (
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
        intent: "cash_update",
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

  const onDeleteCash = async () => {
    if (!edit) {
      return;
    }

    submit(
      {
        intent: "cash_delete",
        id: edit.id,
      },
      {
        method: "POST",
      }
    );
  };

  const onUpdateCard = async (type: ExpensesCash, amount: number) => {
    if (!editCardProvider) {
      return;
    }

    if (editCardVariant === "edit" && editCard) {
      submit(
        {
          intent: "card_update",
          id: editCard.id,
          content: JSON.stringify({
            date: editCard.date,
            type: [type],
            cardProvider: editCardProvider.id,
            amount,
          } satisfies ExpensesCardSaveType),
        },
        {
          method: "POST",
        }
      );
    } else if (editCardVariant === "new") {
      submit(
        {
          intent: "card_save",
          content: JSON.stringify({
            date: `${params.year}-${params.month}-1`,
            type: [type],
            cardProvider: editCardProvider.id,
            amount,
          } satisfies ExpensesCardSaveType),
        },
        {
          method: "POST",
        }
      );
    }
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
                spacing="12px"
                bg="white"
                m="0 -16px"
                p="16px"
                borderY="1px solid"
                borderTopColor="gray.100"
                borderBottomColor="gray.100"
              >
                {cardProvider.map((provider) => (
                  <VStack
                    key={provider.id}
                    as="button"
                    onClick={() => {
                      const r: ExpensesCardType | undefined = card.find(
                        ({ cardProvider }) =>
                          cardProvider.name === provider.name
                      );
                      if (r) {
                        setEditCard(r);
                        setEditCardVariant("edit");
                      } else {
                        setEditCardVariant("new");
                      }
                      setEditCardProvider(provider);
                      onOpenExpensesCardUpdateModal();
                    }}
                    justifyContent="center"
                    alignItems="stretch"
                    gap="8px"
                    h="80px"
                    p="0 8px"
                    rounded="8px"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Text textAlign="left" textStyle="textHeading">
                      {provider.name}
                    </Text>
                    <Flex
                      justifyContent="flex-end"
                      alignItems="center"
                      fontSize="26px"
                      fontWeight="bold"
                      fontFamily="amount"
                      wordBreak="break-word"
                      textAlign="right"
                      lineHeight="30px"
                    >
                      {`¥${card.find(({ cardProvider }) => cardProvider.id === provider.id)?.amount.toLocaleString() ?? 0}`}
                    </Flex>
                  </VStack>
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
          onSave={onUpdateCash}
          onSavePreset={onSavePreset}
          onDelete={() => onDeleteCash()}
        />
      )}
      <ExpensesCardEditModal
        expenses={editCard}
        date={{ year: params.year, month: params.month }}
        cardProvider={editCardProvider}
        isOpen={isOpenExpensesCardUpdateModal}
        onClose={onCloseExpensesCardUpdateModal}
        onSave={onUpdateCard}
      />
    </>
  );
};

export default ExpensesList;
