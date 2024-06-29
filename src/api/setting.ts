import { client, settingClient } from "~/libs/client";
import {
  SettingPresetType,
  SettingCommonType,
  SettingCardProviderType,
  SettingCardProviderBaseType,
  SettingPresetBaseType,
  SettingCommonBaseType,
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
        orders: "order",
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
  content: SettingCardProviderBaseType
) => Promise<SettingCardProviderType> = async (
  id: string,
  content: SettingCardProviderBaseType
) => {
  const response = (await client.update({
    endpoint: "card_provider",
    contentId: id,
    content,
  })) as SettingCardProviderType;

  return response;
};

export const deleteCardProvider = async (id: string) => {
  await client.delete({
    endpoint: "card_provider",
    contentId: id,
  });
};

export const getPresets: () => Promise<SettingPresetType[]> = async () => {
  const response = (
    await settingClient.get({
      endpoint: "presets",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as SettingPresetType[];

  return response;
};

export const savePreset: (
  content: SettingPresetBaseType
) => Promise<SettingPresetType> = async (content: SettingPresetBaseType) => {
  const response = (await settingClient.create({
    endpoint: "presets",
    content,
  })) as SettingPresetType;

  return response;
};

export const updatePreset: (
  id: string,
  content: SettingPresetBaseType
) => Promise<SettingPresetType> = async (
  id: string,
  content: SettingPresetBaseType
) => {
  const response = (await settingClient.update({
    endpoint: "presets",
    contentId: id,
    content,
  })) as SettingPresetType;

  return response;
};

export const deletePreset = async (id: string) => {
  await settingClient.delete({
    endpoint: "presets",
    contentId: id,
  });
};

export const getTargetAmount: () => Promise<number> = async () => {
  const response = (await settingClient.get({
    endpoint: "common",
  })) as SettingCommonType;

  return response.targetAmount;
};

export const updateCommon: (
  content: SettingCommonBaseType
) => Promise<SettingCommonType> = async (content: SettingCommonBaseType) => {
  const response = (await settingClient.update({
    endpoint: "common",
    content,
  })) as SettingCommonType;

  return response;
};
