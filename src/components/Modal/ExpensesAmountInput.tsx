import { FC, useState } from "react";
import { Center, Flex, Text, VStack } from "@chakra-ui/react";

const NUMBERS = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];

type Props = {
  type: "expenses" | "income";
  defaultValue?: number;
  onChange: (amount: number) => void;
};

const ExpensesAmountInput: FC<Props> = ({ type, defaultValue, onChange }) => {
  const [result, setResult] = useState<string>(
    defaultValue ? String(defaultValue) : ""
  );

  return (
    <VStack gap="16px" w="100%">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        h="48px"
      >
        <Center
          as="button"
          type="button"
          onClick={() => {
            setResult("");
            onChange(0);
          }}
          w="calc(((100% * 0.8 + 2px) - 4px * 3) / 3)"
          h="48px"
          fontSize="20px"
          fontFamily="amount"
          transition="background 0.2s"
          layerStyle="buttonBackgroundTransition.300"
        >
          Clr
        </Center>
        <Text as="span" fontSize="40px" fontFamily="amount">
          <Text as="span" color="gray.500">
            {`${type === "income" ? "+ " : ""}¥`}
          </Text>
          <Text
            as="span"
            sx={{
              ...(type === "income" && {
                color: "green.400",
              }),
            }}
          >
            {Number(result.length ? result : "0").toLocaleString()}
          </Text>
        </Text>
      </Flex>
      <Flex gap="4px" w="100%">
        <Flex flexWrap="wrap" gap="4px" w="100%">
          {NUMBERS.map((number) => (
            <Center
              as="button"
              type="button"
              key={number}
              onClick={() => {
                setResult((p) => (p.length >= 7 ? p : `${p}${number}`));
                onChange(
                  Number(result.length >= 7 ? result : `${result}${number}`)
                );
              }}
              w="calc((100% - 4px * 2) / 3)"
              h="56px"
              fontSize="22px"
              fontFamily="amount"
              layerStyle="buttonBackgroundTransition.200"
            >
              {number}
            </Center>
          ))}
          <Center
            as="button"
            type="button"
            onClick={() => {
              setResult((p) => (p.length >= 7 ? p : p.length ? `${p}0` : p));
              onChange(
                Number(
                  result.length >= 7
                    ? result
                    : result.length
                      ? `${result}0`
                      : result
                )
              );
            }}
            w="calc((100% - 4px * 2) / 3)"
            h="56px"
            fontSize="22px"
            fontFamily="amount"
            layerStyle="buttonBackgroundTransition.200"
          >
            0
          </Center>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default ExpensesAmountInput;
