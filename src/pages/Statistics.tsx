import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import {
  getExpensesAllCash,
  getExpensesAllCard,
  getTargetAmount,
} from "~/api/expenses";
import { LoaderData } from "~/types";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Center, Flex, Text, VStack } from "@chakra-ui/react";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const allCash = await getExpensesAllCash();
  const allCard = await getExpensesAllCard();

  const archives = [
    ...new Set([
      ...allCash.map(({ date }) => date.substring(0, 7)),
      ...allCard.map(({ date }) => date.substring(0, 7)),
    ]),
  ].sort();

  const totalAmount = archives.map((item) => {
    const cash = allCash
      .filter(({ date }) => date.startsWith(item))
      .map(({ amount }) => amount)
      .reduce((sum, element) => sum + element, 0);
    const rakuten = allCard
      .filter(
        ({ date, cardProvider }) =>
          cardProvider.includes("楽天カード") && date.startsWith(item)
      )
      .map(({ amount }) => amount)
      .reduce((sum, element) => sum + element, 0);
    const epos = allCard
      .filter(
        ({ date, cardProvider }) =>
          cardProvider.includes("エポスカード") && date.startsWith(item)
      )
      .map(({ amount }) => amount)
      .reduce((sum, element) => sum + element, 0);

    return {
      period: item,
      cash,
      card: {
        rakuten,
        epos,
      },
      total: rakuten + epos + cash,
    };
  });

  const targetAmount = await getTargetAmount();

  return { archives, totalAmount, targetAmount };
};

const Statistics: FC = () => {
  const { archives, totalAmount, targetAmount } = useLoaderData() as LoaderData<
    typeof loader
  >;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const data = {
    labels: archives,
    datasets: [
      {
        label: "現金",
        data: totalAmount.map(({ cash }) => cash),
        backgroundColor: "rgba(99, 188, 255, 0.5)",
      },
      {
        label: "楽天カード",
        data: totalAmount.map(({ card }) => card.rakuten),
        backgroundColor: "rgba(224, 102, 102, 0.5)",
      },
      {
        label: "エポスカード",
        data: totalAmount.map(({ card }) => card.epos),
        backgroundColor: "rgba(144, 99, 255, 0.5)",
      },
    ],
  };

  const total = totalAmount
    .map((item) => item.total)
    .reduce((sum, element) => sum + element, 0);

  const average = Math.trunc(total / totalAmount.length);
  const difference = targetAmount - average;

  const LIST = [
    [
      {
        label: "ひと月の平均利用額",
        amount: `¥${average.toLocaleString()}`,
        variant: "black",
      },
      {
        label: "目標金額",
        amount: `¥${targetAmount.toLocaleString()}`,
        variant: "black",
      },
    ],
    [
      {
        label: "目標金額との差",
        amount: `${Number.isInteger(difference) ? "+ " : ""}¥${difference.toLocaleString()}`,
        variant: Number.isInteger(difference) ? "green" : undefined,
        width: "100%",
      },
    ],
  ];

  return (
    <VStack alignItems="stretch" gap="24px" m="-24px -16px" p="24px 16px">
      <Center w="100%" fontWeight="bold">
        {`${archives[0].replace("-", ".")}から${archives[archives.length - 1].replace("-", ".")}の収支`}
      </Center>
      <Bar options={options} data={data} />
      <VStack alignItems="stretch" gap="16px" p={0}>
        {LIST.map((array, i) => (
          <Flex key={i} justifyContent="center" flexWrap="wrap" gap="12px">
            {array.map((item) => (
              <VStack key={item.label} alignItems="stretch" gap="8px" flex={1}>
                <Text
                  color="gray.600"
                  fontSize="13px"
                  fontWeight="bold"
                  lineHeight="13px"
                >
                  {item.label}
                </Text>
                <Flex
                  justifyContent="flex-end"
                  alignItems="center"
                  h="72px"
                  bg="gray.100"
                  p="0 8px"
                  rounded="8px"
                  fontSize="26px"
                  fontWeight="bold"
                  wordBreak="break-word"
                  textAlign="right"
                  lineHeight="30px"
                  {...(item.variant === "green" && { color: "green.400" })}
                >
                  {item.amount}
                </Flex>
              </VStack>
            ))}
          </Flex>
        ))}
      </VStack>
    </VStack>
  );
};

export default Statistics;
