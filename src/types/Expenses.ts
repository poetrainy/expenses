import { MicroCMSType } from "~/types/MicroCMS";
import { CashlessTargetType } from "~/types/Settings";

export type ExpensesCash = "expenses" | "income";

export type ExpensesCashBaseType = {
  date: string;
  category: ExpensesCash[];
  memo: string;
  amount: number;
};

export type ExpensesCashlessBaseType = {
  date: string;
  category: ExpensesCash[];
  amount: number;
  target: CashlessTargetType;
};

export type ExpensesCashlessSaveType = {
  date: string;
  category: ExpensesCash[];
  amount: number;
  target: string;
};

export type ExpensesCashType = MicroCMSType & ExpensesCashBaseType;

export type ExpensesCashlessType = MicroCMSType & ExpensesCashlessBaseType;
