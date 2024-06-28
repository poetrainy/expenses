import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    body: {
      color: "gray.800",
      bg: "gray.50",
      fontSize: "14px",
      fontFamily: "body",
    },
    a: {
      "&:hover": {
        textDecor: "none",
      },
    },
    li: {
      listStyleType: "none",
    },
  },
};
const fonts = {
  body: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
  amount: "'Inter', sans-serif",
};
const layerStyles = {
  buttonBackgroundTransition: {
    100: {
      bg: "transparent",
      transition: "background 0.2s",
      "&:hover": {
        bg: "gray.100",
        textDecor: "none",
        cursor: "pointer",
      },
      "&:active": {
        bg: "gray.200",
      },
      "&:focus-visible": {
        bg: "gray.200",
      },
    },
    200: {
      bg: "gray.100",
      transition: "background 0.2s",
      "&:hover": {
        bg: "gray.200",
        textDecor: "none",
        cursor: "pointer",
      },
      "&:active": {
        bg: "gray.300",
      },
      "&:focus-visible": {
        bg: "gray.300",
      },
    },
    300: {
      bg: "gray.200",
      transition: "background 0.2s",
      "&:hover": {
        bg: "gray.300",
        textDecor: "none",
        cursor: "pointer",
      },
      "&:active": {
        bg: "gray.400",
      },
      "&:focus-visible": {
        bg: "gray.400",
      },
    },
  },
};

const theme = extendTheme({
  styles,
  fonts,
  layerStyles,
});

export default theme;
