import { settingClient } from "~/libs/client";
import { CommonType, CommonBaseType } from "~/types/Settings";

export const getTargetAmount: () => Promise<number> = async () => {
  const response = (await settingClient.get({
    endpoint: "common",
  })) as CommonType;

  return response.targetAmount;
};

export const updateCommon: (
  content: CommonBaseType
) => Promise<CommonType> = async (content: CommonBaseType) => {
  const response = (await settingClient.update({
    endpoint: "common",
    content,
  })) as CommonType;

  return response;
};
