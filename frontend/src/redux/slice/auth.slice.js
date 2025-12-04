import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../api/authService.js";

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const response = await authService.login(email, password);

			if (response.data && response.data.data) {
				const userData = response.data.data;
				const token = userData.token;
				
				if (!token) {
					return rejectWithValue("No token received from server");
				}

				localStorage.setItem("user", JSON.stringify(userData));
				localStorage.setItem("token", token);
				
				return {
					success: true,
					user: userData,
					token: token
				};
			} else {
				return rejectWithValue(response.data?.message || "Login failed.");
			}
		} catch (error) {
			const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
			return rejectWithValue(message);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: JSON.parse(localStorage.getItem("user")) || null,
		token: localStorage.getItem("token") || null,
		isAuthenticated: !!localStorage.getItem("token"),
		status: "idle", // Changed from 'initializing' to 'idle' as a standard initial state
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.status = "idle";
			state.error = null;
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			localStorage.removeItem("tss_user"); // Clear old key nếu có
		},

		initializeAuth: (state) => {
			const storedUser = localStorage.getItem("user");
			const storedToken = localStorage.getItem("token");
			if (storedUser && storedToken) {
				try {
					state.user = JSON.parse(storedUser);
					state.token = storedToken;
					state.isAuthenticated = true;
					state.status = "succeeded"; // If initialized successfully
				} catch (e) {
					console.error("Failed to parse stored user or token:", e);
					localStorage.removeItem("user");
					localStorage.removeItem("token"); // Clean up 'token'
					state.user = null;
					state.token = null;
					state.isAuthenticated = false;
					state.status = "failed"; // If initialization failed
				}
			} else {
				state.status = "idle";
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "loading"; // Use 'loading' for pending state
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.payload || "Login failed due to an unknown error.";
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			});
	},
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;