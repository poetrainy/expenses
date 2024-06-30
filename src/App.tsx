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
import Settings, { loader as loaderSettings } from "~/pages/Settings";
import "~/styles/index.css";
import SettingCashless, {
  action as actionSettingCashless,
  loader as loaderSettingCashless,
} from "~/pages/Settings/Cashless";
import SettingCashlessNew, {
  action as actionSettingCashlessNew,
  loader as loaderSettingCashlessNew,
} from "~/pages/Settings/CashlessNew";
import SettingPresets, {
  action as actionSettingPresets,
  loader as loaderSettingPresets,
} from "~/pages/Settings/Presets";
import SettingPresetNew, {
  action as actionSettingPresetNew,
} from "~/pages/Settings/PresetNew";
import SettingTargetAmount, {
  action as actionSettingTargetAmount,
  loader as loaderSettingTargetAmount,
} from "~/pages/Settings/TargetAmount";

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
        <Route path="settings" element={<Settings />} loader={loaderSettings} />
        <Route
          path="settings/cashless"
          element={<SettingCashless />}
          action={actionSettingCashless}
          loader={loaderSettingCashless}
        />
        <Route
          path="settings/cashless/new"
          element={<SettingCashlessNew />}
          action={actionSettingCashlessNew}
          loader={loaderSettingCashlessNew}
        />
        <Route
          path="settings/presets"
          element={<SettingPresets />}
          action={actionSettingPresets}
          loader={loaderSettingPresets}
        />
        <Route
          path="settings/presets/new"
          element={<SettingPresetNew />}
          action={actionSettingPresetNew}
        />
        <Route
          path="settings/targetAmount"
          element={<SettingTargetAmount />}
          action={actionSettingTargetAmount}
          loader={loaderSettingTargetAmount}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
