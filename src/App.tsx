import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import ExpensesList, {
  action as actionExpensesList,
  loader as loaderExpensesList,
} from "~/pages/ExpensesList";
import Root from "~/pages/Root";
import { getPath } from "~/libs/getPath";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route
          path="/"
          element={<div></div>}
          loader={() => redirect(getPath())}
        />
        <Route
          path=":year/:month"
          element={<ExpensesList />}
          action={actionExpensesList}
          loader={loaderExpensesList}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
