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
  getExpensesFilteredCashless,
  getExpensesFilteredCash,
  saveExpensesCashless,
  updateExpensesCashless,
  updateExpensesCash,
} from "~/api/expenses";
import { getCashlessTarget } from "~/api/cashless";
import { savePreset } from "~/api/presets";
import { formatDate } from "~/libs/format";
import { LoaderData } from "~/types";
import {
  ExpensesCashlessSaveType,
  ExpensesCashlessType,
  ExpensesCash,
  ExpensesCashBaseType,
  ExpensesCashType,
} from "~/types/Expenses";
import ExpensesCashOperationModal from "~/components/Modal/ExpensesCashOperationModal";
import ListContainer from "~/components/ListContainer";
import { useSetPageContext } from "~/context/usePageContext";
import { CashlessTargetType, PresetBaseType } from "~/types/Settings";
import ExpensesCashlessUpdateModal from "~/components/Modal/ExpensesCashlessUpdateModal";

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

    case "cashless_save": {
      const content = JSON.parse(
        formData.get("content") as string
      ) as ExpensesCashlessSaveType;

      try {
        await saveExpensesCashless(content);

        return redirect(currentPath);
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "cashless_update": {
      const id = formData.get("id") as string;
      const content = JSON.parse(
        formData.get("content") as string
      ) as ExpensesCashlessSaveType;

      try {
        await updateExpensesCashless(id, content);

        return redirect(currentPath);
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "save_preset": {
      const content = JSON.parse(
        formData.get("content") as string
      ) as PresetBaseType;

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
  const now = new Date();
  const year = params.year ?? String(now.getFullYear());
  const month = params.month ?? String(now.getMonth() + 1);

  const filteredCash = await getExpensesFilteredCash(
    year,
    month.length === 1 ? `0${month}` : month
  );
  const filteredCashless = await getExpensesFilteredCashless(
    year,
    month.length === 1 ? `0${month}` : month
  );

  const cashlessTarget = await getCashlessTarget();

  return {
    cash: filteredCash,
    cashless: filteredCashless,
    cashlessTarget,
    params: { year, month },
  };
};

const ExpensesList: FC = () => {
  const { cash, cashless, cashlessTarget, params } =
    useLoaderData() as LoaderData<typeof loader>;
  const submit = useSubmit();

  useSetPageContext({ title: "Expenses" });

  const [edit, setEdit] = useState<ExpensesCashType>();
  const [editCashlessVariant, setEditCashlessVariant] = useState<
    "new" | "edit"
  >("new");
  const [editCashless, setEditCashless] = useState<ExpensesCashlessType>();
  const [editCashlessTarget, setEditCashlessTarget] =
    useState<CashlessTargetType>();

  const {
    isOpen: isOpenExpensesCashlessUpdateModal,
    onOpen: onOpenExpensesCashlessUpdateModal,
    onClose: onCloseExpensesCashlessUpdateModal,
  } = useDisclosure();

  const onUpdateCash = async (
    date: string,
    category: ExpensesCash,
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
          category: [category],
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

  const onUpdateCashless = async (category: ExpensesCash, amount: number) => {
    if (!editCashlessTarget) {
      return;
    }

    if (editCashlessVariant === "edit" && editCashless) {
      submit(
        {
          intent: "cashless_update",
          id: editCashless.id,
          content: JSON.stringify({
            date: editCashless.date,
            category: [category],
            target: editCashless.id,
            amount,
          } satisfies ExpensesCashlessSaveType),
        },
        {
          method: "POST",
        }
      );
    } else if (editCashlessVariant === "new") {
      submit(
        {
          intent: "cashless_save",
          content: JSON.stringify({
            date: `${params.year}-${params.month}-1`,
            category: [category],
            target: editCashlessTarget.id,
            amount,
          } satisfies ExpensesCashlessSaveType),
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
        } satisfies PresetBaseType),
      },
      {
        method: "POST",
      }
    );
  };

  const total = [
    ...cash.map(({ category, amount }) =>
      category.includes("expenses") ? amount : -amount
    ),
    ...cashless.map(({ amount }) => amount),
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
                              item.category.includes("income")
                                ? "green.400"
                                : "gray.700"
                            }
                            fontSize="16px"
                            fontWeight="bold"
                            fontFamily="amount"
                          >
                            {`${item.category.includes("income") ? "+" : ""} ¥${item.amount.toLocaleString()}`}
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
                p="28px 16px"
                borderY="1px solid"
                borderTopColor="gray.100"
                borderBottomColor="gray.100"
              >
                {cashlessTarget.map((target) => (
                  <VStack
                    key={target.id}
                    as="button"
                    onClick={() => {
                      const r: ExpensesCashlessType | undefined = cashless.find(
                        (item) => item.target.name === target.name
                      );
                      if (r) {
                        setEditCashless(r);
                        setEditCashlessVariant("edit");
                      } else {
                        setEditCashlessVariant("new");
                      }
                      setEditCashlessTarget(target);
                      onOpenExpensesCashlessUpdateModal();
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
                      {target.name}
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
                      {`¥${cashless.find((item) => item.target.id === target.id)?.amount.toLocaleString() ?? 0}`}
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
      <ExpensesCashlessUpdateModal
        expenses={editCashless}
        date={{ year: params.year, month: params.month }}
        cashless={editCashlessTarget}
        isOpen={isOpenExpensesCashlessUpdateModal}
        onClose={onCloseExpensesCashlessUpdateModal}
        onSave={onUpdateCashless}
      />
    </>
  );
};

export default ExpensesList;
