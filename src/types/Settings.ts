import { MicroCMSType } from "~/types/MicroCMS";

export type SettingCardProviderBaseType = {
  name: string;
  color: string;
  order: number;
};

export type SettingCardProviderType = MicroCMSType &
  SettingCardProviderBaseType;

export type SettingCommonType = MicroCMSType & {
  targetAmount: number;
};

export type SettingPresetsType = MicroCMSType & {
  memo: string;
  amount: number;
};
