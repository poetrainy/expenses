import { WriteApiRequestResult } from "microcms-js-sdk";
import { client } from "~/libs/client";
import {
  ExpensesCardBaseType,
  ExpensesCardProviderType,
  ExpensesCardType,
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

export const getExpensesAllCard: () => Promise<
  ExpensesCardType[]
> = async () => {
  const response = (
    await client.get({
      endpoint: "card",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as ExpensesCardType[];

  return response;
};

export const getExpensesFilteredCard: (
  year: string,
  month: string
) => Promise<ExpensesCardType[]> = async (year: string, month: string) => {
  const response = (
    await client.get({
      endpoint: "card",
      queries: {
        offset: 0,
        limit: 100,
        filters: `date[begins_with]${year}-${month}`,
      },
    })
  ).contents as ExpensesCardType[];

  return response;
};

export const getExpensesCard: (
  id: string
) => Promise<ExpensesCardType> = async (id: string) => {
  const response = (await client.get({
    endpoint: `card/${id}`,
  })) as ExpensesCardType;

  return response;
};

export const saveExpensesCard: (
  content: ExpensesCardBaseType
) => Promise<WriteApiRequestResult> = async (content: ExpensesCardBaseType) => {
  const response = await client.create({
    endpoint: "card",
    content,
  });

  return response;
};

export const updateExpensesCard: (
  id: string,
  content: ExpensesCardBaseType
) => Promise<WriteApiRequestResult> = async (
  id: string,
  content: ExpensesCardBaseType
) => {
  const response = await client.update({
    endpoint: "card",
    contentId: id,
    content,
  });

  return response;
};

export const deleteExpensesCard = async (id: string) => {
  await client.delete({
    endpoint: "card",
    contentId: id,
  });
};

export const getExpensesCardProvider: () => Promise<
  ExpensesCardProviderType[]
> = async () => {
  const response = (
    await client.get({
      endpoint: "card_provider",
      queries: {
        offset: 0,
        limit: 100,
      },
    })
  ).contents as ExpensesCardProviderType[];

  return response;
};
