import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import { message } from "antd";
import type { AsyncThunkConfig, RootState } from "@/store";
import { DataStatus } from "@/store/types";
import { serializeAxiosError } from "@/store/utils";
import StorageManager from "@/services/storage";
import request from "@/services/request";

const TOKEN_KEY = "token";
const namespace = "auth";

export type AuthState = {
  loading: boolean;
  errorMessage: unknown;
  dataStatus: DataStatus;
  userInfo: any;
  token: string;
  authorities: any[];
  isAuthenticated: boolean;

  registrationSuccess: boolean;
  registrationFailure: boolean;
  successMessage: any;
};

const initialState: AuthState = {
  loading: false,
  errorMessage: null,
  dataStatus: DataStatus.IDLE,
  userInfo: {},
  token: "",
  authorities: [],
  isAuthenticated: false,

  registrationSuccess: false,
  registrationFailure: false,
  successMessage: null,
};

// async actions
// -----------------------------------------------------------------------

// login
export const loginAction = createAsyncThunk<any, any, AsyncThunkConfig>(
  `${namespace}/login`,
  async (params, { extra }) => {
    const { login } = extra;
    return await login(params)
      .then((result: Recordable) => {
        console.log("用户登录:", result);
        const { code, data } = result;
        if (code === 0) {
          message.success("登录成功");
          return data;
        } else {
          message.warning("登录失败, 请重试!");
          // return result;
        }
      })
      .catch((error) => {
        message.error("登录服务异常");
        return error;
      });
  }
);

// getUserInfo
export const getUserInfoAction = createAsyncThunk<any, any, AsyncThunkConfig>(
  `${namespace}/getUserInfo`,
  async (_, { getState, extra }) => {
    const { getUserInfo } = extra;
    const { auth } = getState();
    return await getUserInfo(auth?.token)
      .then((result: Recordable) => {
        console.log("查看当前用户详情:", result);
        const { code, data } = result;
        if (code === 0) {
          return data;
        } else {
          return result;
        }
      })
      .catch((error) => {
        return error;
      });
  }
);

export const getRolesAction = createAsyncThunk<any, any, AsyncThunkConfig>(
  `${namespace}/getRoles`,
  async (_, { getState, extra }) => {
    const { getRoles } = extra;
    const { auth } = getState();
    return await getRoles(auth?.token)
      .then((result: Recordable) => {
        console.log("查看当前用户角色:", result);
        const { code, data } = result;
        if (code === 0) {
          return data;
        } else {
          return result;
        }
      })
      .catch((error) => {
        return error;
      });
  }
);

export const registerAction = createAsyncThunk(
  `${namespace}/register/create_account`,
  async (data: { login: string; email: string; password: string }, { dispatch }) => {
    const result = await request({
      url: "/api/register",
      method: "post",
      data: data,
    });

    return result;
  },
  { serializeError: serializeAxiosError }
);

// reducers
// -----------------------------------------------------------------------
const userSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    logout(state: AuthState) {
      StorageManager.remove(TOKEN_KEY);
      state.token = "";
      state.userInfo = {};
      state.isAuthenticated = false;
    },
    remove(state: AuthState) {
      state.token = "";
    },
    reset() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state) => {
        state.dataStatus = DataStatus.PENDING;
        state.loading = true;
      })
      .addCase(loginAction.fulfilled, (state, { payload }) => {
        state.dataStatus = DataStatus.FULFILLED;
        state.loading = false;

        StorageManager.set(TOKEN_KEY, payload?.token);
        state.token = payload?.token;
        state.userInfo = {
          username: payload?.username,
        };
        if (payload?.token) {
          // 暂时测试使用
          state.authorities = payload.roles;

          state.isAuthenticated = true;
        }
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.dataStatus = DataStatus.REJECTED;
        state.loading = false;
      })

      .addCase(getRolesAction.fulfilled, (state, action) => {
        state.authorities = action.payload.data;
      })
      .addCase(getUserInfoAction.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })

      .addCase(registerAction.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerAction.rejected, (state, action) => ({
        ...initialState,
        registrationFailure: true,
        errorMessage: action.error.message,
      }))
      .addCase(registerAction.fulfilled, () => ({
        ...initialState,
        registrationSuccess: true,
        successMessage: "register.messages.success",
      }))

      .addMatcher(isFulfilled(getUserInfoAction, getRolesAction), (state) => {
        state.dataStatus = DataStatus.FULFILLED;
        state.loading = false;
      })
      .addMatcher(isPending(getUserInfoAction, getRolesAction), (state) => {
        state.dataStatus = DataStatus.PENDING;
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(isRejected(getUserInfoAction, getRolesAction), (state, action) => {
        state.dataStatus = DataStatus.REJECTED;
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;

export const { logout, remove, reset } = userSlice.actions;

export default userSlice.reducer;
