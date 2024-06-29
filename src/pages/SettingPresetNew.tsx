import { FC, useState } from "react";
import { ActionFunctionArgs, redirect, useSubmit } from "react-router-dom";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { updatePreset } from "~/api/setting";
import { useSetPageContext } from "~/context/usePageContext";
import { SettingPresetBaseType } from "~/types/Settings";
import { useSubmitting } from "~/hooks/useSubmitting";
import AmountInputContainer from "~/components/AmountInputContainer";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

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
};

const SettingPresetNew: FC = () => {
  const { isSubmittingAndLoading } = useSubmitting();
  const submit = useSubmit();

  useSetPageContext({ title: "プリセット", backLink: true });

  const [submitCount, setSubmitCount] = useState(0);
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");

  const onSavePreset = () => {
    submit(
      {
        content: JSON.stringify({
          memo,
          amount: Number(amount),
        } satisfies SettingPresetBaseType),
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
          メモ
        </Text>
        <Input
          value={memo}
          placeholder="e.g. 楽天カード"
          onChange={(e) => setMemo(e.target.value)}
          h="56px"
          bg="white"
          rounded="8px"
        />
      </VStack>
      <VStack alignItems="stretch" gap="8px" p={0}>
        <Text as="h2" textStyle="textHeading">
          金額
        </Text>
        <AmountInputContainer>
          <Input
            type="number"
            value={amount}
            placeholder="e.g. 1100"
            onChange={(e) =>
              setAmount((p) => (p.length >= 7 ? p : e.target.value))
            }
          />
        </AmountInputContainer>
      </VStack>
      <Button
        isLoading={isSubmittingAndLoading && !!submitCount}
        isDisabled={isSubmittingAndLoading || !memo.length || !amount}
        loadingText="保存"
        onClick={() => {
          onSavePreset();
          setSubmitCount((p) => p + 1);
        }}
        fontSize="14px"
      >
        保存
      </Button>
    </VStack>
  );
};

export default SettingPresetNew;
