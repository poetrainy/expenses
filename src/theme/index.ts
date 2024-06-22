import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    body: {
      color: "black",
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
