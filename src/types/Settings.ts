import { MicroCMSType } from "~/types/MicroCMS";

export type SettingCardProviderType = MicroCMSType & {
  name: string;
  color: string;
};

export type SettingCommonType = MicroCMSType & {
  targetAmount: number;
};

export type SettingPresetsType = MicroCMSType & {
  memo: string;
  amount: number;
};
