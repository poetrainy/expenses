import { FC } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { getExpensesAllCash, getExpensesAllCashless } from "~/api/expenses";
import Layout from "~/components/Layout";
import { LoaderData } from "~/types";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const allCash = await getExpensesAllCash();
  const allCashless = await getExpensesAllCashless();

  const archives = [
    ...new Set([
      ...allCash.map(({ date }) => date.substring(0, 7)),
      ...allCashless.map(({ date }) => date.substring(0, 7)),
    ]),
  ]
    .sort()
    .map((item) => item.split("-").map((number) => Number(number)));

  return { archives };
};

const Root: FC = () => {
  const { archives } = useLoaderData() as LoaderData<typeof loader>;

  return (
    <Layout archives={archives}>
      <Outlet />
    </Layout>
  );
};

export default Root;
