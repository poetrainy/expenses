import { FC, ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

const AmountInputContainer: FC<Props> = ({ children }) => (
  <Flex
    fontFamily="amount"
    pos="relative"
    sx={{
      "&::after": {
        content: "'¥'",
        h: "fit-content",
        m: "auto",
        pos: "absolute",
        inset: "0 0 0 16px",
        pointerEvents: "none",
        zIndex: 5,
      },
      ">input": {
        h: "56px",
        bg: "white",
        rounded: "8px",
        textAlign: "right",
      },
    }}
  >
    {children}
  </Flex>
);

export default AmountInputContainer;
