import { MicroCMSType } from "~/types/MicroCMS";

export type ExpensesCash = "expenses" | "income";

export type ExpensesCardProvider = "楽天カード" | "エポスカード";

export type ExpensesCashBaseType = {
  date: string;
  type: ExpensesCash[];
  purpose: string;
  amount: number;
  supplement?: string;
};

export type ExpensesCardBaseType = {
  date: string;
  amount: number;
  cardProvider: ExpensesCardProvider[];
};

export type ExpensesCashType = MicroCMSType & ExpensesCashBaseType;

export type ExpensesCardType = MicroCMSType & ExpensesCardBaseType;
