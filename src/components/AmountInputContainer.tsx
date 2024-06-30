import { FC, ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
  size?: "medium" | "large";
};

const AmountInputContainer: FC<Props> = ({ children, size = "medium" }) => (
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
        bg: "white",
        rounded: "8px",
        textAlign: "right",
        ...(size === "large" && {
          h: "56px",
        }),
      },
    }}
  >
    {children}
  </Flex>
);

export default AmountInputContainer;
