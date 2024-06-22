import { FC, useState } from "react";
import {
  Button,
  Center,
  Flex,
  Input,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import OriginalModal from "~/components/OriginalModal";
import { ExpensesCash } from "~/types/Expenses";

const NUMBERS = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
const ARITHMETICS: string[] = ["/", "*", "-", "+"];

export const Arithmetic = () => (
  <VStack gap="4px" p={0} w="calc(100% * 0.2 + 2px)">
    {ARITHMETICS.map((arithmetic) => (
      <Center
        as="button"
        type="button"
        key={arithmetic}
        w="100%"
        h="calc(100% * 4 * 2 / 3)"
        bg="gray.200"
        fontSize="20px"
      >
        {arithmetic}
      </Center>
    ))}
  </VStack>
);

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    date: string,
    type: ExpensesCash,
    purpose: string,
    amount: number
  ) => void;
};

const NewExpensesModal: FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<ExpensesCash>("expenses");
  const [purpose, setPurpose] = useState<string>("");
  const [result, setResult] = useState<string>("");

  return (
    <OriginalModal
      isOpen={isOpen}
      onClose={onClose}
      size={["full", "3xl"]}
      heading="登録する"
    >
      <Tabs isFitted defaultIndex={type === "expenses" ? 0 : 1}>
        <TabList>
          <Tab onClick={() => setType("expenses")}>支出</Tab>
          <Tab onClick={() => setType("income")}>収入</Tab>
        </TabList>
      </Tabs>
      <VStack alignItems="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.600" fontWeight="bold">
            日付
          </Text>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            w="80%"
          />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.600" fontWeight="bold">
            内容
          </Text>
          <Input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            w="80%"
            placeholder="e.g. やまもとクリニック"
          />
        </Flex>
      </VStack>
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
            onClick={() => setResult("")}
            w="calc(((100% * 0.8 + 2px) - 4px * 3) / 3)"
            h="48px"
            bg="gray.200"
            fontSize="20px"
          >
            Clr
          </Center>
          <Text as="span" fontSize="40px">
            <Text as="span" color="gray.500">
              ¥
            </Text>
            <Text
              as="span"
              color={type === "expenses" ? "gray.800" : "green.400"}
            >
              {Number(result.length ? result : "0").toLocaleString()}
            </Text>
          </Text>
        </Flex>
        <Flex gap="4px" w="100%">
          <Flex
            flexWrap="wrap"
            gap="4px"
            w="100%"
            // w="calc(100% * 0.8 + 2px)"
          >
            {NUMBERS.map((number) => (
              <Center
                as="button"
                type="button"
                key={number}
                onClick={() => setResult((p) => `${p}${number}`)}
                w="calc((100% - 4px * 2) / 3)"
                h="56px"
                bg="gray.100"
                fontSize="20px"
              >
                {number}
              </Center>
            ))}
            <Center
              as="button"
              type="button"
              onClick={() => setResult((p) => (p.length ? `${p}0` : p))}
              w="calc((100% - 4px * 2) / 3)"
              h="56px"
              bg="gray.100"
              fontSize="20px"
            >
              0
            </Center>
          </Flex>
          {/* <Arithmetic /> */}
        </Flex>
      </VStack>
      <Spacer />
      <Button
        w="100%"
        type="button"
        onClick={() => {
          onSave(`${date}T15:00:00.000Z`, type, purpose, Number(result));
          setDate("");
          setType("expenses");
          setPurpose("");
          setResult("");
        }}
        isDisabled={!date.length || !purpose.length || !result.length}
      >
        保存する
      </Button>
    </OriginalModal>
  );
};

export default NewExpensesModal;
