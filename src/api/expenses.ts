import { WriteApiRequestResult } from "microcms-js-sdk";
import { client } from "~/libs/client";
import {
  ExpensesCashlessSaveType,
  ExpensesCashlessType,
  ExpensesCashBaseType,
  ExpensesCashType,
} from "~/types/Expenses";

export const getExpensesAllCash: () => Promise<
  ExpensesCashType[]
> = async () => {
  const response = (
    await client.get({
      endpoint: "cash",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as ExpensesCashType[];

  return response;
};

export const getExpensesFilteredCash: (
  year: string,
  month: string
) => Promise<ExpensesCashType[]> = async (year: string, month: string) => {
  const response = (
    await client.get({
      endpoint: "cash",
      queries: {
        offset: 0,
        limit: 100,
        filters: `date[begins_with]${year}-${month}`,
      },
    })
  ).contents as ExpensesCashType[];

  return response;
};

export const getExpensesCash: (
  id: string
) => Promise<ExpensesCashType> = async (id: string) => {
  const response = (await client.get({
    endpoint: `cash/${id}`,
  })) as ExpensesCashType;

  return response;
};

export const saveExpensesCash: (
  content: ExpensesCashBaseType
) => Promise<WriteApiRequestResult> = async (content: ExpensesCashBaseType) => {
  const response = await client.create({
    endpoint: "cash",
    content,
  });

  return response;
};

export const updateExpensesCash: (
  id: string,
  content: ExpensesCashBaseType
) => Promise<WriteApiRequestResult> = async (
  id: string,
  content: ExpensesCashBaseType
) => {
  const response = await client.update({
    endpoint: "cash",
    contentId: id,
    content,
  });

  return response;
};

export const deleteExpensesCash = async (id: string) => {
  await client.delete({
    endpoint: "cash",
    contentId: id,
  });
};

export const getExpensesAllCashless: () => Promise<
  ExpensesCashlessType[]
> = async () => {
  const response = (
    await client.get({
      endpoint: "cashless",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as ExpensesCashlessType[];

  return response;
};

export const getExpensesFilteredCashless: (
  year: string,
  month: string
) => Promise<ExpensesCashlessType[]> = async (year: string, month: string) => {
  const response = (
    await client.get({
      endpoint: "cashless",
      queries: {
        offset: 0,
        limit: 100,
        filters: `date[begins_with]${year}-${month}`,
      },
    })
  ).contents as ExpensesCashlessType[];

  return response;
};

export const getExpensesCashless: (
  id: string
) => Promise<ExpensesCashlessType> = async (id: string) => {
  const response = (await client.get({
    endpoint: `cashless/${id}`,
  })) as ExpensesCashlessType;

  return response;
};

export const saveExpensesCashless: (
  content: ExpensesCashlessSaveType
) => Promise<WriteApiRequestResult> = async (
  content: ExpensesCashlessSaveType
) => {
  const response = await client.create({
    endpoint: "cashless",
    content,
  });

  return response;
};

export const updateExpensesCashless: (
  id: string,
  content: ExpensesCashlessSaveType
) => Promise<WriteApiRequestResult> = async (
  id: string,
  content: ExpensesCashlessSaveType
) => {
  const response = await client.update({
    endpoint: "cashless",
    contentId: id,
    content,
  });

  return response;
};

export const deleteExpensesCashless = async (id: string) => {
  await client.delete({
    endpoint: "cashless",
    contentId: id,
  });
};
