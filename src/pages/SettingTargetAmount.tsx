import { Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { getTargetAmount, updateCommon } from "~/api/setting";
import { useSetPageContext } from "~/context/usePageContext";
import { useSubmitting } from "~/hooks/useSubmitting";
import { LoaderData } from "~/types";
import { SettingCommonBaseType } from "~/types/Settings";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const content = JSON.parse(
    formData.get("content") as string
  ) as SettingCommonBaseType;

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
  const { isSubmittingAndLoading } = useSubmitting();

  useSetPageContext({ title: "目標金額", backLink: true });

  const [updateTargetAmount, setUpdateAmount] = useState(String(targetAmount));

  const onUpdateTargetAmount = () => {
    submit(
      {
        content: JSON.stringify({
          targetAmount: Number(updateTargetAmount),
        } satisfies SettingCommonBaseType),
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
        <Flex
          fontFamily="amount"
          pos="relative"
          sx={{
            "&::after": {
              content: "'¥'",
              h: "fit-content",
              m: "auto",
              pos: "absolute",
              inset: "0 0 0 16px",
              pointerEvents: "none",
              zIndex: 5,
            },
          }}
        >
          <Input
            type="number"
            value={updateTargetAmount}
            placeholder="e.g. 200000"
            onChange={(e) =>
              setUpdateAmount((p) => (p.length >= 7 ? p : e.target.value))
            }
            h="56px"
            bg="white"
            rounded="8px"
            textAlign="right"
          />
        </Flex>
        <Text color="gray.500" fontSize="12px">
          0〜999999の間を指定できます
        </Text>
      </VStack>
      <Button
        isLoading={isSubmittingAndLoading}
        isDisabled={isSubmittingAndLoading}
        loadingText="保存"
        onClick={() => onUpdateTargetAmount()}
        fontSize="14px"
      >
        保存
      </Button>
    </VStack>
  );
};

export default SettingTargetAmount;
