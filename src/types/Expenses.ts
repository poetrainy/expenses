import { MicroCMSType } from "~/types/MicroCMS";
import { SettingCardProviderType } from "~/types/Settings";

export type ExpensesCash = "expenses" | "income";

export type ExpensesCashBaseType = {
  date: string;
  type: ExpensesCash[];
  memo: string;
  amount: number;
};

export type ExpensesCardBaseType = {
  date: string;
  amount: number;
  cardProvider: SettingCardProviderType;
};

export type ExpensesCashType = MicroCMSType & ExpensesCashBaseType;

export type ExpensesCardType = MicroCMSType & ExpensesCardBaseType;
