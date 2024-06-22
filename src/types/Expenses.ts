import { MicroCMSType } from "~/types/MicroCMS";

export type ExpensesCash = "expenses" | "income";

export type ExpensesCardProviderType = MicroCMSType & {
  name: string;
};

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
  cardProvider: ExpensesCardProviderType;
};

export type ExpensesCashType = MicroCMSType & ExpensesCashBaseType;

export type ExpensesCardType = MicroCMSType & ExpensesCardBaseType;
