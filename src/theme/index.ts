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
  amount: "'Inter', sans-serif",
};
const layerStyles = {
  listItemSingleLine: {
    bg: "transparent",
    transition: "background 0.2s",
    "&:hover": {
      textDecor: "none",
      bg: "gray.100",
      cursor: "pointer",
    },
    "&:active": {
      bg: "gray.200",
    },
    "&:focus-visible": {
      bg: "gray.200",
    },
  },
};

const theme = extendTheme({
  styles,
  fonts,
  layerStyles,
});

export default theme;
