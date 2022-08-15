import { combineReducers } from "@reduxjs/toolkit";

import global from "./modules/global";
import theme from "./modules/theme";
import counter from "@/pages/demos/state/counter";
import user from "@/pages/users/state";
import auth from "@/pages/auth/state";

const rootReducers = combineReducers({
  global,
  theme,

  user,
  auth,
  counter,
});

export default rootReducers;
