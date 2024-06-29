import { FC, useState } from "react";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import {
  Box,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useDisclosure,
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
import CardProviderDeleteModal from "~/components/Modal/CardProviderDeleteModal";
import { getExpensesAllCard } from "~/api/expenses";
import CardProviderSaveModal from "~/components/Modal/CardProviderSaveModal";
import { useSetPageContext } from "~/context/usePageContext";
import { GRAPH_COLORS } from "~/constants/colors";
import SortChildContainer from "~/components/Sort/SortChildContainer";
import SortParentContainer from "~/components/Sort/SortParentContainer";
import MenuBase from "~/components/MenuBase";
import DragHandleIcon from "@mui/icons-material/DragHandle";

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

        return redirect("/settings/cardProvider");
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

        return redirect("/settings/cardProvider");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "delete": {
      const id = formData.get("id") as string;

      try {
        await deleteCardProvider(id);

        return redirect("/settings/cardProvider");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    default: {
      return null;
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

  useSetPageContext({ title: "所持クレジットカード", backLink: true });

  const [sortable, setSortable] = useState<boolean>(false);
  const [cardProviderId, setCardProviderId] = useState(
    cardProvider.map(({ id }) => id)
  );

  const {
    isOpen: isOpenCardProviderSaveModal,
    onOpen: onOpenCardProviderSaveModal,
    onClose: onCloseCardProviderSaveModal,
  } = useDisclosure();
  const [deleteCardProviderData, setDeleteCardProviderData] =
    useState<SettingCardProviderType>();

  const onSaveCardProvider = (name: string) => {
    submit(
      {
        intent: "save",
        content: JSON.stringify({
          name,
          color: GRAPH_COLORS[Math.floor(Math.random() * 6)],
          order: cardProvider.length + 1,
        } satisfies SettingCardProviderBaseType),
      },
      {
        method: "POST",
      }
    );

    onCloseCardProviderSaveModal();
  };

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

    setDeleteCardProviderData(undefined);
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
                <Flex as="li" key={providerId} w="100%">
                  <SortChildContainer id={providerId} sortable={sortable}>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="100%"
                      h="56px"
                      p="0 16px"
                      fontSize="16px"
                    >
                      <Flex alignItems="center" gap="10px">
                        {sortable ? (
                          <Icon as={DragHandleIcon} color="gray.500" />
                        ) : (
                          <Menu>
                            <MenuButton>
                              <Box
                                display="block"
                                boxSize="24px"
                                bg={provider.color}
                                rounded="6px"
                                _hover={{ cursor: "pointer" }}
                              />
                            </MenuButton>
                            <MenuList
                              display="flex"
                              gap="8px"
                              minW="max-content"
                              p="12px"
                              rounded="16px"
                              overflow="hidden"
                            >
                              {GRAPH_COLORS.map((color) => (
                                <MenuItem
                                  key={color}
                                  onClick={() =>
                                    onUpdateCardProvider(provider.id, {
                                      name: provider.name,
                                      order: provider.order,
                                      color,
                                    })
                                  }
                                  boxSize="28px"
                                  minW="28px"
                                  bg={color}
                                  p={0}
                                  rounded="8px"
                                  border="2px solid white"
                                  sx={{
                                    ...(provider.color === color && {
                                      outline: "3px solid",
                                      outlineColor: "blue.100",
                                    }),
                                  }}
                                />
                              ))}
                            </MenuList>
                          </Menu>
                        )}
                        <Editable
                          defaultValue={provider.name}
                          isDisabled={sortable}
                          placeholder="e.g. 楽天カード"
                          onSubmit={(value) =>
                            onUpdateCardProvider(providerId, {
                              ...provider,
                              name: value,
                            })
                          }
                        >
                          <EditablePreview p="8px 0" />
                          <EditableInput w="100%" h="32px" />
                        </Editable>
                      </Flex>
                      {!sortable && (
                        <MenuBase
                          menu={[
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
          <Center
            as="button"
            onClick={() => onOpenCardProviderSaveModal()}
            gap="8px"
            w="fit-content"
            m="auto"
            p="8px 16px"
            fontSize="14px"
            fontWeight="bold"
            opacity="1"
            transition="opacity 0.2s"
            _hover={{ opacity: 0.8 }}
            _active={{ opacity: 0.6 }}
            _focusVisible={{ opacity: 0.6 }}
          >
            <AddIcon boxSize="16px" color="gray.700" />
            <Text as="span" color="gray.600">
              新しいクレジットカード名を登録
            </Text>
          </Center>
        )}
      </VStack>
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
      <CardProviderSaveModal
        isOpen={isOpenCardProviderSaveModal}
        onClose={onCloseCardProviderSaveModal}
        onClick={(value) => onSaveCardProvider(value)}
      />
    </>
  );
};

export default SettingCardProvider;
