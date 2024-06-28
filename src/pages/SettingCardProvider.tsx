import { FC, useState } from "react";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
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
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { SettingCardProviderType } from "~/types/Settings";
import CardProviderDeleteModal from "~/components/Modal/CardProviderDeleteModal";
import { getExpensesAllCard } from "~/api/expenses";
import CardProviderSaveModal from "~/components/Modal/CardProviderSaveModal";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "save": {
      const name = formData.get("name") as string;

      try {
        await saveCardProvider(name);

        return redirect("/settings/cardProvider");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "update": {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;

      try {
        await updateCardProvider(id, name);

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
        name,
      },
      {
        method: "POST",
      }
    );

    onCloseCardProviderSaveModal();
  };

  const onUpdateCardProvider = (id: string, name: string) => {
    submit(
      {
        intent: "update",
        id,
        name,
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

  return (
    <>
      <VStack alignItems="stretch" gap="8px" p={0}>
        <ListContainer>
          {cardProvider.map((provider) => (
            <Flex
              as="li"
              key={provider.id}
              alignItems="center"
              justifyContent="space-between"
              w="100%"
              h="56px"
              p="0 16px"
            >
              <Editable
                defaultValue={provider.name}
                placeholder="e.g. 楽天カード"
                onSubmit={(value) => onUpdateCardProvider(provider.id, value)}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <IconButton
                variant="ghost"
                aria-label="削除"
                icon={<DeleteIcon color="gray.600" />}
                onClick={() => setDeleteCardProviderData(provider)}
                boxSize="32px"
                minW="32px"
              />
            </Flex>
          ))}
        </ListContainer>
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
            新しいカード会社を登録
          </Text>
        </Center>
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
