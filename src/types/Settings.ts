import { MicroCMSType } from "~/types/MicroCMS";

export type SettingCardProviderBaseType = {
  name: string;
  color: string;
  order: number;
};

export type SettingCardProviderType = MicroCMSType &
  SettingCardProviderBaseType;

export type SettingCommonBaseType = {
  targetAmount: number;
};

export type SettingCommonType = MicroCMSType & SettingCommonBaseType;

export type SettingPresetBaseType = {
  memo: string;
  amount: number;
};

export type SettingPresetType = MicroCMSType & SettingPresetBaseType;
