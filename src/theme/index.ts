import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    body: {
      color: "gray.800",
      bg: "gray.50",
      fontSize: "14px",
      fontFamily: "body",
      a: {
        textDecoration: "none",
      },
      li: {
        listStyleType: "none",
      },
    },
  },
};
const fonts = {
  body: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
};

const theme = extendTheme({
  styles,
  fonts,
});

export default theme;
