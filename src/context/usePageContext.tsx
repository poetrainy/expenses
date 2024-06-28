import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

export type PageType = { title?: string; backLink?: boolean };

// eslint-disable-next-line react-refresh/only-export-components
const getterContext = createContext<PageType | undefined>(undefined);
const setterContext = createContext<
  React.Dispatch<React.SetStateAction<PageType | undefined>>
>(() => void 0);

// eslint-disable-next-line react-refresh/only-export-components
export const usePageContext = () => {
  return useContext(getterContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSetPageContext = (context: PageType) => {
  const setter = useContext(setterContext);

  useLayoutEffect(() => {
    setter((prev) =>
      JSON.stringify(prev) !== JSON.stringify(context) ? context : prev
    );
  });
};

export const PageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<PageType | undefined>();

  return (
    <getterContext.Provider value={context}>
      <setterContext.Provider value={setContext}>
        {children}
      </setterContext.Provider>
    </getterContext.Provider>
  );
};
