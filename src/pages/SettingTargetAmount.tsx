import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { getTargetAmount, updateCommon } from "~/api/common";
import AmountInputContainer from "~/components/AmountInputContainer";
import { useSetPageContext } from "~/context/usePageContext";
import { useSubmitting } from "~/hooks/useSubmitting";
import { LoaderData } from "~/types";
import { CommonBaseType } from "~/types/Settings";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const content = JSON.parse(
    formData.get("content") as string
  ) as CommonBaseType;

  try {
    await updateCommon(content);

    return redirect("/settings/targetAmount");
  } catch (e) {
    console.error(e);

    return null;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const targetAmount = await getTargetAmount();

  return { targetAmount };
};

const SettingTargetAmount: FC = () => {
  const { targetAmount } = useLoaderData() as LoaderData<typeof loader>;
  const submit = useSubmit();

  useSetPageContext({ title: "目標金額", backLink: true });

  const { isSubmittingAndLoading } = useSubmitting();
  const [submitCount, setSubmitCount] = useState(0);

  const [updateTargetAmount, setUpdateAmount] = useState(String(targetAmount));

  const onUpdateTargetAmount = () => {
    submit(
      {
        content: JSON.stringify({
          targetAmount: Number(updateTargetAmount),
        } satisfies CommonBaseType),
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
          目標金額
        </Text>
        <AmountInputContainer size="large">
          <Input
            type="number"
            value={updateTargetAmount}
            placeholder="e.g. 200000"
            onChange={(e) =>
              setUpdateAmount((p) => (p.length >= 7 ? p : e.target.value))
            }
          />
        </AmountInputContainer>
        <Text color="gray.600" fontSize="12px">
          0〜999999の間を指定できます
        </Text>
      </VStack>
      <Button
        isLoading={isSubmittingAndLoading && !!submitCount}
        isDisabled={isSubmittingAndLoading}
        loadingText="保存"
        onClick={() => {
          onUpdateTargetAmount();
          setSubmitCount((p) => p + 1);
        }}
        fontSize="14px"
      >
        保存
      </Button>
    </VStack>
  );
};

export default SettingTargetAmount;
