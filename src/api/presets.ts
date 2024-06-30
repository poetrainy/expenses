import { settingClient } from "~/libs/client";
import { PresetType, PresetBaseType } from "~/types/Settings";

export const getPresets: () => Promise<PresetType[]> = async () => {
  const response = (
    await settingClient.get({
      endpoint: "presets",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as PresetType[];

  return response;
};

export const savePreset: (
  content: PresetBaseType
) => Promise<PresetType> = async (content: PresetBaseType) => {
  const response = (await settingClient.create({
    endpoint: "presets",
    content,
  })) as PresetType;

  return response;
};

export const updatePreset: (
  id: string,
  content: PresetBaseType
) => Promise<PresetType> = async (
  id: string,
  content: PresetBaseType
) => {
  const response = (await settingClient.update({
    endpoint: "presets",
    contentId: id,
    content,
  })) as PresetType;

  return response;
};

export const deletePreset = async (id: string) => {
  await settingClient.delete({
    endpoint: "presets",
    contentId: id,
  });
};
