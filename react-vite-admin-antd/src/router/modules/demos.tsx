import { lazy } from "react";
import BasicLayout from "@/layouts/basic-layout";
import type { RouteObject } from "../types";


const Demos = lazy(() => import("@/pages/demos"));
const Demo1 = lazy(() => import("@/pages/demos/demo1"));
const Demo2 = lazy(() => import("@/pages/demos/demo2"));
const Demo3 = lazy(() => import("@/pages/demos/demo3"));
const Demo4 = lazy(() => import("@/pages/demos/demo4"));
const Demo5 = lazy(() => import("@/pages/demos/demo5"));
const Demo6 = lazy(() => import("@/pages/demos/demo6"));
const Demo7 = lazy(() => import("@/pages/demos/demo7"));
const Demo8 = lazy(() => import("@/pages/demos/demo8"));
const Demo9 = lazy(() => import("@/pages/demos/demo9"));

const demoRouter: RouteObject[] = [
  {
    path: "/demos",
    element: <BasicLayout />,
    meta: {
      title: "例子演示",
      icon: "",
    },
    children: [
      {
        path: "",
        element: <Demos />,
        children: [
          { path: ":id", element: <>组件详情</> },
          { path: "list", element: <>组件列表</> },
        ],
      },
      {
        path: "index",
        children: [
          { index: true, element: <>组件首页</> },
          { path: "list", element: <>组件列表</> },
        ],
      },
      {
        path: "demo1",
        element: <Demo1 />,
        meta: {
          title: "例子1",
        },
      },
      {
        path: "demo2",
        element: <Demo2 />,
        meta: {
          title: "例子2",
        },
      },
      {
        path: "demo3",
        element: <Demo3 />,
        meta: {
          title: "例子3",
        },
      },
      {
        path: "demo4",
        element: <Demo4 />,
        meta: {
          title: "例子4",
        },
      },
      {
        path: "demo5",
        element: <Demo5 />,
        meta: {
          title: "例子5",
        },
      },
      {
        path: "demo6",
        element: <Demo6 />,
        meta: {
          title: "例子6",
        },
      },
      {
        path: "demo7",
        element: <Demo7 />,
        meta: {
          title: "例子7",
        },
      },
      {
        path: "demo8",
        element: <Demo8 />,
        meta: {
          title: "例子8",
        },
      },
      {
        path: "demo9",
        element: <Demo9 />,
        meta: {
          title: "例子9",
        },
      },
    ],
  },
];

export default demoRouter;
