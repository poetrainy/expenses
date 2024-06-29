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
import SettingCardProvider, {
  action as actionSettingCardProvider,
  loader as loaderSettingCardProvider,
} from "~/pages/SettingCardProvider";
import SettingCardProviderNew, {
  action as actionSettingCardProviderNew,
  loader as loaderSettingCardProviderNew,
} from "~/pages/SettingCardProviderNew";
import SettingPresets, {
  action as actionSettingPresets,
  loader as loaderSettingPresets,
} from "~/pages/SettingPresets";
import SettingPresetNew, {
  action as actionSettingPresetNew
} from "~/pages/SettingPresetNew";
import SettingTargetAmount, {
  action as actionSettingTargetAmount,
  loader as loaderSettingTargetAmount,
} from "~/pages/SettingTargetAmount";

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
          path="settings/card"
          element={<SettingCardProvider />}
          action={actionSettingCardProvider}
          loader={loaderSettingCardProvider}
        />
        <Route
          path="settings/card/new"
          element={<SettingCardProviderNew />}
          action={actionSettingCardProviderNew}
          loader={loaderSettingCardProviderNew}
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
