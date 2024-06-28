import { client, settingClient } from "~/libs/client";
import {
  SettingPresetsType,
  SettingCommonType,
  SettingCardProviderType,
  SettingCardProviderBaseType,
} from "~/types/Settings";

export const getCardProvider: () => Promise<
  SettingCardProviderType[]
> = async () => {
  const response = (
    await client.get({
      endpoint: "card_provider",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as SettingCardProviderType[];

  return response;
};

export const saveCardProvider: (
  content: SettingCardProviderBaseType
) => Promise<SettingCardProviderType> = async (
  content: SettingCardProviderBaseType
) => {
  const response = (await client.create({
    endpoint: "card_provider",
    content,
  })) as SettingCardProviderType;

  return response;
};

export const updateCardProvider: (
  id: string,
  name: string
) => Promise<SettingCardProviderType> = async (id: string, name: string) => {
  const response = (await client.update({
    endpoint: "card_provider",
    contentId: id,
    content: {
      name,
    },
  })) as SettingCardProviderType;

  return response;
};

export const deleteCardProvider = async (id: string) => {
  await client.delete({
    endpoint: "card_provider",
    contentId: id,
  });
};

export const getPresets: () => Promise<SettingPresetsType[]> = async () => {
  const response = (
    await settingClient.get({
      endpoint: "presets",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as SettingPresetsType[];

  return response;
};

export const getTargetAmount: () => Promise<number> = async () => {
  const response = (await settingClient.get({
    endpoint: "common",
  })) as SettingCommonType;

  return response.targetAmount;
};
