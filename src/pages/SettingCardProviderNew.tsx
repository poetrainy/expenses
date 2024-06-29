import { FC, useState } from "react";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { getCardProvider, saveCardProvider } from "~/api/setting";
import { LoaderData } from "~/types";
import { SettingCardProviderBaseType } from "~/types/Settings";
import { useSetPageContext } from "~/context/usePageContext";
import { useSubmitting } from "~/hooks/useSubmitting";
import { GRAPH_COLORS } from "~/constants/colors";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
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
};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const cardProviderLength = (await getCardProvider()).length;

  return { cardProviderLength };
};

const SettingCardProvider: FC = () => {
  const { cardProviderLength } = useLoaderData() as LoaderData<typeof loader>;
  const submit = useSubmit();
  const { isSubmittingAndLoading } = useSubmitting();

  useSetPageContext({ title: "電子決済登録", backLink: true });

  const [submitCount, setSubmitCount] = useState(0);
  const [name, setName] = useState("");
  const [color, setColor] = useState(GRAPH_COLORS[0]);

  const onSaveCardProvider = () => {
    submit(
      {
        content: JSON.stringify({
          name,
          color,
          order: cardProviderLength + 1,
        } satisfies SettingCardProviderBaseType),
      },
      {
        method: "POST",
      }
    );
  };

  return (
    <VStack alignItems="stretch" gap="24px" p={0}>
      <VStack alignItems="stretch" gap="8px" p={0}>
        <Text as="h2" textStyle="textHeading">
          決済サービス名称
        </Text>
        <Input
          value={name}
          placeholder="e.g. ExamplePay"
          onChange={(e) => setName(e.target.value)}
          h="56px"
          bg="white"
          rounded="8px"
        />
      </VStack>
      <VStack alignItems="stretch" gap="8px" p={0}>
        <Text as="h2" textStyle="textHeading">
          グラフの色
        </Text>
        <Flex gap="4px" p="2px">
          {GRAPH_COLORS.map((graphColor) => (
            <Box
              key={graphColor}
              as="button"
              disabled={isSubmittingAndLoading}
              onClick={() => {
                setColor(graphColor);
                setSubmitCount((p) => p + 1);
              }}
              boxSize="28px"
              minW="28px"
              bg={graphColor}
              p={0}
              rounded="8px"
              border="2px solid"
              borderColor="gray.50"
              outlineColor="transparent"
              sx={{
                ...(color === graphColor && {
                  outline: "3px solid",
                  outlineColor: "blue.100",
                  borderColor: "white",
                }),
              }}
            />
          ))}
        </Flex>
      </VStack>
      <Button
        isLoading={isSubmittingAndLoading && !!submitCount}
        isDisabled={isSubmittingAndLoading || !name.length}
        loadingText="保存"
        onClick={() => onSaveCardProvider()}
        fontSize="14px"
      >
        保存
      </Button>
    </VStack>
  );
};

export default SettingCardProvider;
