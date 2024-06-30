import { FC, useEffect, useState } from "react";
import {
  ActionFunctionArgs,
  Link as RouterLink,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import {
  Box,
  Flex,
  Icon,
  Link as ChakraUILink,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  deleteCashless,
  getCashlessTarget,
  saveCashlessTarget,
  updateCashlessTarget,
} from "~/api/cashless";
import { LoaderData } from "~/types";
import ListContainer from "~/components/ListContainer";
import { AddIcon } from "@chakra-ui/icons";
import { CashlessTargetBaseType, CashlessTargetType } from "~/types/Settings";
import { getExpensesAllCashless } from "~/api/expenses";
import { useSetPageContext } from "~/context/usePageContext";
import CashlessDeleteModal from "~/components/Modal/CashlessDeleteModal";
import CashlessUpdateModal from "~/components/Modal/CashlessUpdateModal";
import SortChildContainer from "~/components/Sort/SortChildContainer";
import SortParentContainer from "~/components/Sort/SortParentContainer";
import MenuBase from "~/components/MenuBase";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useSubmitting } from "~/hooks/useSubmitting";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "save": {
      const content = JSON.parse(
        formData.get("content") as string
      ) as CashlessTargetBaseType;

      try {
        await saveCashlessTarget(content);

        return redirect("/settings/cashless");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "update": {
      const id = formData.get("id") as string;
      const content = JSON.parse(
        formData.get("content") as string
      ) as CashlessTargetBaseType;

      try {
        await updateCashlessTarget(id, content);

        return redirect("/settings/cashless");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "delete": {
      const id = formData.get("id") as string;

      try {
        await deleteCashless(id);

        return redirect("/settings/cashless");
      } catch (e) {
        console.error(e);

        return null;
      }
    }
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const cashlessTarget = await getCashlessTarget();

  const allCashless = await getExpensesAllCashless();
  const cashlessTargetId = cashlessTarget.map(({ id }) => id);
  const cashlessDataLength: {
    id: string;
    length: number;
  }[] = cashlessTargetId.map((id) => {
    return {
      id,
      length: allCashless.filter(({ target }) => target.id === id).length,
    };
  });

  return { cashlessTarget, cashlessDataLength };
};

const Cashless: FC = () => {
  const { cashlessTarget, cashlessDataLength } = useLoaderData() as LoaderData<
    typeof loader
  >;
  const submit = useSubmit();
  const { isSubmittingAndLoading } = useSubmitting();

  useSetPageContext({ title: "電子決済リスト", backLink: true });

  const [sortable, setSortable] = useState<boolean>(false);
  const [cashlessTargetId, setCashlessTargetId] = useState(
    cashlessTarget.map(({ id }) => id)
  );

  const [updateCashlessData, setUpdateCashlessData] =
    useState<CashlessTargetType>();
  const [deleteCashlessData, setDeleteCashlessData] =
    useState<CashlessTargetType>();

  useEffect(() => {
    if (!isSubmittingAndLoading) {
      setDeleteCashlessData(undefined);
    }
  }, [isSubmittingAndLoading]);

  const onUpdateCashless = (id: string, content: CashlessTargetBaseType) => {
    submit(
      {
        intent: "update",
        id,
        content: JSON.stringify(content),
      },
      {
        method: "POST",
      }
    );
  };

  const onDeleteCashless = () => {
    if (!deleteCashlessData) {
      return;
    }

    submit(
      {
        intent: "delete",
        id: deleteCashlessData.id,
      },
      {
        method: "POST",
      }
    );
  };

  const updateCashlessOrder = () => {
    if (sortable) {
      const newArray = (
        cashlessTargetId
          .map((str, i) => {
            return {
              prev: cashlessTarget.find(({ id }) => id === str)!,
              newOrder: i + 1,
            };
          })
          .filter(
            ({ prev, newOrder }) => !!prev && newOrder !== prev.order
          ) as {
          prev: CashlessTargetType;
          newOrder: number;
        }[]
      ).map(({ prev, newOrder }) => {
        return {
          ...prev,
          order: newOrder,
        };
      });
      newArray.forEach(({ id, name, color, order }) =>
        onUpdateCashless(id, { name, color, order })
      );
    }

    setSortable((p) => !p);
  };

  return (
    <>
      <VStack alignItems="stretch" gap="8px" p={0}>
        <Box
          as="button"
          onClick={() => updateCashlessOrder()}
          textStyle="textButton"
          ml="auto"
          opacity={1}
          transition="opacity 0.2s"
          sx={{
            ...(isSubmittingAndLoading && {
              opacity: 0.4,
              pointerEvents: "none",
            }),
          }}
        >
          {sortable ? "保存" : "並べ替え"}
        </Box>
        <SortParentContainer
          id="cashless"
          items={cashlessTarget}
          onChange={(id: string[]) => setCashlessTargetId(id)}
        >
          <ListContainer>
            {cashlessTargetId.map((item) => {
              const provider = cashlessTarget.find(({ id }) => id === item);
              if (!provider) {
                return <></>;
              }

              return (
                <Flex
                  as="li"
                  key={item}
                  w="100%"
                  opacity={1}
                  transition="opacity 0.2s"
                  sx={{
                    ...(isSubmittingAndLoading && {
                      opacity: 0.4,
                      pointerEvents: "none",
                    }),
                  }}
                >
                  <SortChildContainer id={item} sortable={sortable}>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="100%"
                      h="56px"
                      p="0 16px"
                    >
                      <Flex alignItems="center" gap="8px">
                        {sortable ? (
                          <Icon
                            as={DragHandleIcon}
                            boxSize="20px"
                            color="gray.500"
                          />
                        ) : (
                          <Box
                            boxSize="20px"
                            bg={provider.color}
                            rounded="6px"
                          />
                        )}
                        <Text as="span">{provider.name}</Text>
                      </Flex>
                      {!sortable && (
                        <MenuBase
                          menu={[
                            {
                              variant: "normal",
                              label: "編集",
                              onClick: () => setUpdateCashlessData(provider),
                            },
                            {
                              variant: "danger",
                              label: "削除",
                              onClick: () => setDeleteCashlessData(provider),
                            },
                          ]}
                        />
                      )}
                    </Flex>
                  </SortChildContainer>
                </Flex>
              );
            })}
          </ListContainer>
        </SortParentContainer>
        {!sortable && (
          <ChakraUILink
            as={RouterLink}
            to="new"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="8px"
            w="fit-content"
            p="12px 0"
            fontSize="14px"
            fontWeight="bold"
            opacity={1}
            transition="opacity 0.2s"
            _hover={{ opacity: 0.8 }}
            _active={{ opacity: 0.6 }}
            _focusVisible={{ opacity: 0.6 }}
            sx={{
              ...(isSubmittingAndLoading && {
                opacity: 0.4,
                pointerEvents: "none",
              }),
            }}
          >
            <AddIcon boxSize="16px" color="gray.700" />
            <Text as="span" color="gray.600">
              電子決済登録
            </Text>
          </ChakraUILink>
        )}
      </VStack>
      <CashlessUpdateModal
        isOpen={!!updateCashlessData}
        onClose={() => setUpdateCashlessData(undefined)}
        onClick={(name: string, color: string) =>
          updateCashlessData &&
          onUpdateCashless(updateCashlessData.id, {
            name,
            color,
            order: updateCashlessData?.order,
          })
        }
        prevName={updateCashlessData?.name ?? ""}
        prevColor={updateCashlessData?.color ?? ""}
      />
      <CashlessDeleteModal
        isOpen={!!deleteCashlessData}
        onClose={() => setDeleteCashlessData(undefined)}
        name={deleteCashlessData?.name ?? ""}
        cashlessDataLength={
          cashlessDataLength.find(({ id }) => deleteCashlessData?.id === id)
            ?.length ?? 0
        }
        onClick={() => onDeleteCashless()}
      />
    </>
  );
};

export default Cashless;
