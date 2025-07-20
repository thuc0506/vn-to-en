import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import requestApi from '../api/requestApi';

// Interface state
interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
  token: localStorage.getItem('token'),

};

// authSlice.ts
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await requestApi.getRequest('/auth/me');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lấy thông tin người dùng thất bại');
    }
  }
);


// API Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await requestApi('/auth/login', 'POST', { email, password });
      return res.data; // Backend trả về { user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Đăng nhập thất bại');
    }
  }
);


// API Register
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, username }: { email: string; password: string; username: string }, { rejectWithValue }) => {
    try {
      const res = await requestApi.postRequest('/auth/register', { email, password, username });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Đăng ký thất bại');
    }
  }
);

// API Google Login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleUserData: { googleId: string; email: string; username: string; avatar: string }, { rejectWithValue }) => {
    try {
      const res = await requestApi.postRequest('/auth/google/callback', googleUserData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Đăng nhập Google thất bại');
    }
  }
);


// Thêm API logout (nếu cần gọi backend để blacklist refresh token)
export const apiLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await requestApi.postRequest('/auth/logout', {}); // backend sẽ tự clear cookie HttpOnly
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Đăng xuất thất bại');
    }
  }
);


// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Xử lý đăng nhập
      // Khi gọi login, sẽ gọi API backend để xử lý đăng nhập
      // Nếu thành công, sẽ lưu thông tin người dùng vào Redux state 
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;

      })
      .addCase(login.rejected, (state, action) => {
        const errorData = action.payload as any;

        // Nếu payload có remainingAttempts thì gộp vào message
        if (errorData?.remainingAttempts !== undefined) {
          if (errorData.remainingAttempts === 0) {
            state.error = String(errorData.message);
          } else {
            state.error = `${String(errorData.message)}. Bạn còn ${errorData.remainingAttempts} lần thử.`;
          }
        } else {
          state.error = String(errorData?.message || 'Đăng nhập thất bại');
        }


        state.loading = false;
      })


      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Xử lý đăng ký
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })



      // Xử lý đăng nhập với Google
      // Khi gọi googleLogin, sẽ gọi API backend để xử lý đăng nhập với Google
      // Nếu thành công, sẽ lưu thông tin người dùng vào Redux state 
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;

      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Xử lý đăng xuất
      // Khi gọi apiLogout, sẽ gọi API backend để xóa cookie HttpOnly
      .addCase(apiLogout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('user');
      })
      .addCase(apiLogout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch user info
      // Khi gọi fetchMe, sẽ lấy thông tin người dùng từ backend
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        const err = action.payload as any;
        if (err?.message !== 'Chưa đăng nhập') {
          state.error = err?.message || 'Lỗi không xác định';
        } else {
          state.error = null; // Không set lỗi nếu chưa đăng nhập
        }
      });


  },
});

export const { logout, setUser } = authSlice.actions;


export default authSlice.reducer;