// @ts-nocheck
import { RouteConfig } from "vue-router";

export type RoutesConfig = { [key: string]: RouteConfig };

// 路由配置
export const routesConfig = Object.freeze<RoutesConfig>({
  // 登录
  login: {
    path: "/login",
    name: "login",
    component: "views/containers/login/index",
    hidden: true
  },
  // 子用户登录
  sublogin: {
    path: "/sublogin",
    name: "sublogin",
    component: "views/containers/login/sub-login",
    hidden: true
  },
  // 扫描二维码登录
  qrcodelogin: {
    path: "/qrcodelogin",
    name: "qrcodelogin",
    component: "views/containers/login/qrcode-login",
    hidden: true
  },
  // 忘记密码
  forgot: {
    path: "/forgot",
    name: "forgot",
    component: "views/containers/forgot/index",
    hidden: true
  },
  // 注册
  register: {
    path: "/register",
    name: "register",
    component: "views/containers/register/index",
    hidden: true
  },
  // 关于我们
  about: {
    name: "about",
    path: "/about",
    component: "views/containers/about",
    hidden: true
  },
  callback: {
    name: "callback",
    path: "/callback",
    component: "views/containers/exception/callback",
    hidden: true
  },
  // 主框架
  index: {
    path: "/",
    name: "index",
    component: "views/layouts/menu-view",
    hidden: true
  },
  // 异常
  unauthorized: {
    name: "unauthorized",
    path: "/401",
    component: "views/containers/exception/401",
    hidden: true
  },
  notFound: {
    name: "notFound",
    path: "*",
    component: "views/containers/exception/404",
    hidden: true
  },
  error: {
    name: "error",
    path: "/error",
    component: "views/containers/exception/error",
    hidden: true
  },
});
