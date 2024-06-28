import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, useRevalidator } from "react-router-dom";
import { Center, Heading, IconButton, useDisclosure } from "@chakra-ui/react";
import { ChevronLeftIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { saveExpensesCash } from "~/api/expenses";
import MenuDrawer from "~/components/MenuDrawer";
import OperationExpensesModal from "~/components/Modal/OperationExpensesModal";
import { ExpensesCash, ExpensesCashBaseType } from "~/types/Expenses";
import { usePageContext } from "~/context/usePageContext";

type Props = {
  archives: number[][];
};

const Header: FC<Props> = ({ archives }) => {
  const location = useLocation();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const pageContext = usePageContext();
  const isExpensesPage = location.pathname.startsWith("/expenses");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    isOpen: isOpenMenuDrawer,
    onOpen: onOpenMenuDrawer,
    onClose: onCloseMenuDrawer,
  } = useDisclosure();

  const {
    isOpen: isOpenOperationExpensesModal,
    onOpen: onOpenOperationExpensesModal,
    onClose: onCloseOperationExpensesModal,
  } = useDisclosure();

  useEffect(() => {
    if (!location.state) {
      return;
    }

    if (location.state.isOpenMenuDrawer === false) {
      onCloseMenuDrawer();
    }
  }, [onCloseMenuDrawer, location]);

  const onExpensesSave = async (
    date: string,
    type: ExpensesCash,
    purpose: string,
    amount: number
  ) => {
    setIsSubmitting(true);

    try {
      await saveExpensesCash({
        date,
        type: [type],
        purpose,
        amount,
      } satisfies ExpensesCashBaseType);

      revalidator.revalidate();
      onCloseOperationExpensesModal();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Center
        w="100%"
        maxW="600px"
        h="56px"
        bg="white"
        m="auto"
        pos="fixed"
        inset="0 0 auto 0"
        zIndex={10}
        borderBottom="1px solid"
        borderBottomColor="gray.100"
      >
        <Heading as="h1" color="gray.700" fontSize="16px">
          {pageContext?.title ?? "poetrainy-expenses"}
        </Heading>
        {pageContext?.backLink && (
          <IconButton
            icon={<ChevronLeftIcon boxSize="32px" />}
            variant="ghost"
            aria-label="前のページに戻る"
            onClick={() => navigate(-1)}
            m="auto"
            pos="absolute"
            inset="0 auto 0 16px"
          />
        )}
        {isExpensesPage && (
          <>
            <IconButton
              icon={<HamburgerIcon boxSize="20px" />}
              variant="ghost"
              aria-label="メニューを開く"
              onClick={() => onOpenMenuDrawer()}
              m="auto"
              pos="absolute"
              inset="0 auto 0 16px"
            />
            <IconButton
              icon={<EditIcon boxSize="20px" />}
              variant="ghost"
              aria-label="収支を登録する"
              onClick={() => onOpenOperationExpensesModal()}
              m="auto"
              pos="absolute"
              inset="0 16px 0 auto"
            />
          </>
        )}
      </Center>
      {isExpensesPage && (
        <>
          <MenuDrawer
            isOpen={isOpenMenuDrawer}
            onClose={onCloseMenuDrawer}
            archives={archives}
          />
          <OperationExpensesModal
            variant="new"
            isOpen={isOpenOperationExpensesModal}
            onClose={onCloseOperationExpensesModal}
            isSubmitting={isSubmitting}
            onSave={(date, type, purpose, amount) =>
              onExpensesSave(date, type, purpose, amount)
            }
          />
        </>
      )}
    </>
  );
};

export default Header;
