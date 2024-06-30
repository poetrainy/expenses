import { MicroCMSType } from "~/types/MicroCMS";

export type CashlessTargetBaseType = {
  name: string;
  color: string;
  order: number;
};

export type CashlessTargetType = MicroCMSType & CashlessTargetBaseType;

export type CommonBaseType = {
  targetAmount: number;
};

export type CommonType = MicroCMSType & CommonBaseType;

export type PresetBaseType = {
  memo: string;
  amount: number;
};

export type PresetType = MicroCMSType & PresetBaseType;
