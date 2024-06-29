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
  deleteCardProvider,
  getCardProvider,
  saveCardProvider,
  updateCardProvider,
} from "~/api/setting";
import { LoaderData } from "~/types";
import ListContainer from "~/components/ListContainer";
import { AddIcon } from "@chakra-ui/icons";
import {
  SettingCardProviderBaseType,
  SettingCardProviderType,
} from "~/types/Settings";
import { getExpensesAllCard } from "~/api/expenses";
import { useSetPageContext } from "~/context/usePageContext";
import CardProviderDeleteModal from "~/components/Modal/CardProviderDeleteModal";
import CardProviderUpdateModal from "~/components/Modal/CardProviderUpdateModal";
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
      ) as SettingCardProviderBaseType;

      try {
        await saveCardProvider(content);

        return redirect("/settings/card");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "update": {
      const id = formData.get("id") as string;
      const content = JSON.parse(
        formData.get("content") as string
      ) as SettingCardProviderBaseType;

      try {
        await updateCardProvider(id, content);

        return redirect("/settings/card");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "delete": {
      const id = formData.get("id") as string;

      try {
        await deleteCardProvider(id);

        return redirect("/settings/card");
      } catch (e) {
        console.error(e);

        return null;
      }
    }
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const cardProvider = await getCardProvider();

  const allCard = await getExpensesAllCard();
  const cardProviderId = cardProvider.map(({ id }) => id);
  const cardDataLength = cardProviderId.map((id) => {
    return {
      id,
      length: allCard.filter(({ cardProvider }) => cardProvider.id === id)
        .length,
    };
  });

  return { cardProvider, cardDataLength };
};

const SettingCardProvider: FC = () => {
  const { cardProvider, cardDataLength } = useLoaderData() as LoaderData<
    typeof loader
  >;
  const submit = useSubmit();
  const { isSubmittingAndLoading } = useSubmitting();

  useSetPageContext({ title: "電子決済リスト", backLink: true });

  const [sortable, setSortable] = useState<boolean>(false);
  const [cardProviderId, setCardProviderId] = useState(
    cardProvider.map(({ id }) => id)
  );

  const [updateCardProviderData, setUpdateCardProviderData] =
    useState<SettingCardProviderType>();
  const [deleteCardProviderData, setDeleteCardProviderData] =
    useState<SettingCardProviderType>();

  useEffect(() => {
    if (!isSubmittingAndLoading) {
      setDeleteCardProviderData(undefined);
    }
  }, [isSubmittingAndLoading]);

  const onUpdateCardProvider = (
    id: string,
    content: SettingCardProviderBaseType
  ) => {
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

  const onDeleteCardProvider = () => {
    if (!deleteCardProviderData) {
      return;
    }

    submit(
      {
        intent: "delete",
        id: deleteCardProviderData.id,
      },
      {
        method: "POST",
      }
    );
  };

  const updateCardProviderOrder = () => {
    if (sortable) {
      const newArray = (
        cardProviderId
          .map((str, i) => {
            return {
              prev: cardProvider.find(({ id }) => id === str)!,
              newOrder: i + 1,
            };
          })
          .filter(
            ({ prev, newOrder }) => !!prev && newOrder !== prev.order
          ) as {
          prev: SettingCardProviderType;
          newOrder: number;
        }[]
      ).map(({ prev, newOrder }) => {
        return {
          ...prev,
          order: newOrder,
        };
      });
      newArray.forEach(({ id, name, color, order }) =>
        onUpdateCardProvider(id, { name, color, order })
      );
    }

    setSortable((p) => !p);
  };

  return (
    <>
      <VStack alignItems="stretch" gap="8px" p={0}>
        <Box
          as="button"
          onClick={() => updateCardProviderOrder()}
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
          id="cardProvider"
          items={cardProvider}
          onChange={(id: string[]) => setCardProviderId(id)}
        >
          <ListContainer>
            {cardProviderId.map((providerId) => {
              const provider = cardProvider.find(({ id }) => id === providerId);
              if (!provider) {
                return <></>;
              }

              return (
                <Flex
                  as="li"
                  key={providerId}
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
                  <SortChildContainer id={providerId} sortable={sortable}>
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
                              onClick: () =>
                                setUpdateCardProviderData(provider),
                            },
                            {
                              variant: "danger",
                              label: "削除",
                              onClick: () =>
                                setDeleteCardProviderData(provider),
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
      <CardProviderUpdateModal
        isOpen={!!updateCardProviderData}
        onClose={() => setUpdateCardProviderData(undefined)}
        onClick={(name: string, color: string) =>
          updateCardProviderData &&
          onUpdateCardProvider(updateCardProviderData.id, {
            name,
            color,
            order: updateCardProviderData?.order,
          })
        }
        prevName={updateCardProviderData?.name ?? ""}
        prevColor={updateCardProviderData?.color ?? ""}
      />
      <CardProviderDeleteModal
        isOpen={!!deleteCardProviderData}
        onClose={() => setDeleteCardProviderData(undefined)}
        name={deleteCardProviderData?.name ?? ""}
        cardDataLength={
          cardDataLength.find(({ id }) => deleteCardProviderData?.id === id)
            ?.length ?? 0
        }
        onClick={() => onDeleteCardProvider()}
      />
    </>
  );
};

export default SettingCardProvider;
