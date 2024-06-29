import { FC, ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Box } from "@chakra-ui/react";

type CardType = {
  id: string;
  sortable: boolean;
  children: ReactNode;
};

const SortChildContainer: FC<CardType> = ({ id, sortable, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return sortable ? (
    <Box
      id={id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      w="100%"
    >
      {children}
    </Box>
  ) : (
    children
  );
};

export default SortChildContainer;
