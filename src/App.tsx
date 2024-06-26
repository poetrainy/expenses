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
import Root, { loader as loaderRoot } from "~/pages/Root";
import { getPath } from "~/libs/getPath";
import Statistics, { loader as loaderStatistics } from "~/pages/Statistics";
import Settings, { loader as loaderSettings }  from "~/pages/Settings";
import "~/styles/index.css";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} loader={loaderRoot}>
        <Route
          path=""
          element={<div></div>}
          loader={() => redirect(getPath())}
        />
        <Route
          path="expenses"
          element={<div></div>}
          loader={() => redirect(getPath())}
        />
        <Route
          path="expenses/:year/:month"
          element={<ExpensesList />}
          action={actionExpensesList}
          loader={loaderExpensesList}
        />
        <Route
          path="statistics"
          element={<Statistics />}
          loader={loaderStatistics}
        />
        <Route
          path="settings"
          element={<Settings />}
          loader={loaderSettings}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
