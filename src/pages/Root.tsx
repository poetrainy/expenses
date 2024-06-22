import { FC } from "react";
import { Outlet } from "react-router-dom";
import Layout from "~/components/Layout";

const Root: FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export default Root;
