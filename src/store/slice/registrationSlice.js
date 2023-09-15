import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from '../../lib/services/userApi';

// First, create the thunk
const loginUser = createAsyncThunk(
  'users/login',
  async (payload, thunkAPI) => {
    const response = await userApi.login(payload)
    return response.data
  }
)

const initialState = {
  user: [],
  loading: false,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUser: (state, action) => ({
    //   ...state,
    //   user: action.payload,
    // }),
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginUser.fulfilled, (state, action) => {
      // Add user to the state array
      state.user.push(action.payload)
    })
  },
});
export const { setUser } = UserSlice.actions;
export default UserSlice.reducer;
