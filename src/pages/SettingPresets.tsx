import { Flex, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import {
  savePreset,
  updatePreset,
  deletePreset,
  getPresets,
} from "~/api/setting";
import ListContainer from "~/components/ListContainer";
import { useSetPageContext } from "~/context/usePageContext";
import { LoaderData } from "~/types";
import { SettingPresetBaseType } from "~/types/Settings";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "save": {
      const content = JSON.parse(
        formData.get("content") as string
      ) as SettingPresetBaseType;

      try {
        await savePreset(content);

        return redirect("/settings/presets");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "update": {
      const id = formData.get("id") as string;
      const content = JSON.parse(
        formData.get("content") as string
      ) as SettingPresetBaseType;

      try {
        await updatePreset(id, content);

        return redirect("/settings/presets");
      } catch (e) {
        console.error(e);

        return null;
      }
    }

    case "delete": {
      const id = formData.get("id") as string;

      try {
        await deletePreset(id);

        return redirect("/settings/presets");
      } catch (e) {
        console.error(e);

        return null;
      }
    }
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const presets = await getPresets();

  return { presets };
};

const SettingPresets: FC = () => {
  const { presets } = useLoaderData() as LoaderData<typeof loader>;
  useSetPageContext({ title: "プリセット", backLink: true });

  return (
    <VStack alignItems="stretch">
      <ListContainer>
        {presets.map(({ id, memo, amount }) => (
          <Flex
            key={id}
            as="li"
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            h="56px"
            p="0 16px"
            layerStyle="buttonBackgroundTransition.100"
          >
            <Text as="span">{memo}</Text>
            <Text as="span">¥{amount}</Text>
          </Flex>
        ))}
      </ListContainer>
    </VStack>
  );
};

export default SettingPresets;
