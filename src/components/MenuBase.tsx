import { FC } from "react";
import {
  Menu,
  MenuButton,
  IconButton,
  Icon,
  MenuList,
  MenuItem,
  Button,
  MenuButtonProps,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = MenuButtonProps & {
  menu: {
    variant: "normal" | "danger";
    label: string;
    onClick: () => void;
  }[];
};

const MenuBase: FC<Props> = ({ menu, ...menuButtonProps }) => (
  <Menu autoSelect={false}>
    <MenuButton
      as={IconButton}
      icon={<Icon as={MoreVertIcon} boxSize="20px" />}
      aria-label="メニューを開く"
      variant="ghost"
      boxSize="32px"
      minW="32px"
      {...menuButtonProps}
    />
    <MenuList rounded="16px" overflow="hidden">
      {menu.map(({ variant, label, onClick }) => (
        <MenuItem
          key={label}
          as={Button}
          variant="ghost"
          colorScheme={variant === "danger" ? "red" : undefined}
          onClick={onClick}
          justifyContent="flex-start"
          h="44px"
          fontSize="14px"
          fontWeight="normal"
          rounded="0"
          {...(variant === "danger" && { color: "red.500" })}
        >
          {label}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

export default MenuBase;
