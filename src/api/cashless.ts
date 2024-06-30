import { client } from "~/libs/client";
import { CashlessTargetType, CashlessTargetBaseType } from "~/types/Settings";

export const getCashlessTarget: () => Promise<CashlessTargetType[]> = async () => {
  const response = (
    await client.get({
      endpoint: "cashless_target",
      queries: {
        offset: 0,
        limit: 100,
        orders: "order",
      },
    })
  ).contents as CashlessTargetType[];

  return response;
};

export const saveCashlessTarget: (
  content: CashlessTargetBaseType
) => Promise<CashlessTargetType> = async (content: CashlessTargetBaseType) => {
  const response = (await client.create({
    endpoint: "cashless_target",
    content,
  })) as CashlessTargetType;

  return response;
};

export const updateCashlessTarget: (
  id: string,
  content: CashlessTargetBaseType
) => Promise<CashlessTargetType> = async (
  id: string,
  content: CashlessTargetBaseType
) => {
  const response = (await client.update({
    endpoint: "cashless_target",
    contentId: id,
    content,
  })) as CashlessTargetType;

  return response;
};

export const deleteCashless = async (id: string) => {
  await client.delete({
    endpoint: "cashless_target",
    contentId: id,
  });
};
