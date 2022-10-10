import {
  createAsyncThunk,
  createSlice,
  CreateSliceOptions,
  Slice,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ILoginParams, IRegisterParams } from "../../Interfaces/auth";
import axios from "axios";
import { toast } from "react-toastify";

export interface IUserState {
  name: string;
  email: string;
  files: Array<string>;
  accessToken: string;
  id: string;
}

export interface IAuthState {
  user: IUserState;
  authLoading: boolean;
}

export const login = createAsyncThunk(
  "auth/login",
  async (params: ILoginParams, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        params
      );
      return data;
    } catch (error) {
      // @ts-ignore
      return rejectWithValue((error as any).response.data.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (params: IRegisterParams, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        params
      );

      console.log(params);

      return data;
    } catch (error) {
      return rejectWithValue((error as any).response.data);
    }
  }
);

const initialState: IAuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : { name: "", email: "", files: [], accessToken: "", id: "" },
  authLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // @ts-ignore
    logout: (state) => {
      state.user = {
        name: "",
        email: "",
        files: [],
        accessToken: "",
        id: "",
      };
      state.authLoading = false;
      localStorage.removeItem("user");
    },
  },
  extraReducers: {
    [`${login.pending}`]: (state, action) => {
      state.authLoading = true;
    },
    [`${login.fulfilled}`]: (state, action) => {
      state.authLoading = false;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    [`${login.rejected}`]: (state, action) => {
      state.authLoading = false;
      state = {
        user: { name: "", email: "", files: [], accessToken: "", id: "" },
        authLoading: false,
      };
      // @ts-ignore
      toast.error("Cannot login :(");
      localStorage.removeItem("user");
    },
    [`${register.pending}`]: (state, action) => {
      state.authLoading = true;
    },
    [`${register.fulfilled}`]: (state, action) => {
      state.authLoading = false;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    [`${register.rejected}`]: (state, action) => {
      state.authLoading = false;
      state = {
        user: { name: "", email: "", files: [], accessToken: "", id: "" },
        authLoading: false,
      };
      localStorage.removeItem("user");
    },
  },
});

// Action creators are generated for each case reducer function
export const { logout } = authSlice.actions;

export default authSlice.reducer;
