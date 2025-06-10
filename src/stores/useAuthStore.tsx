import { create } from "zustand";
import axios from "axios";

interface UserProfile {
  id: string;
  fullName: string;
  position: string;
  department: string;
  mustChangePassword: boolean;
  isAdmin: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  showRefreshPrompt: boolean;
  userProfile: UserProfile | null;
  profileLoading: boolean;
  error: string | null;
  tokenTimeout: NodeJS.Timeout | null;

  // Actions
  setTokens: (access: string, refresh: string) => Promise<void>;
  clearTokens: () => void;
  hydrateTokens: () => void;
  setShowRefreshPrompt: (show: boolean) => void;
  setTokenTimeout: (timeout: NodeJS.Timeout | null) => void;
  fetchUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  accessToken: null,
  refreshToken: null,
  showRefreshPrompt: false,
  userProfile: null,
  profileLoading: false,
  error: null,
  tokenTimeout: null,

  // Set tokens and schedule automatic logout
  setTokens: async (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("accessTokenTime", Date.now().toString());

    // Clear any existing timeout
    const { tokenTimeout } = get();
    if (tokenTimeout) clearTimeout(tokenTimeout);

    // Set new timeout for 15 minutes (matches token expiry)
    const newTimeout = setTimeout(() => {
      get().clearTokens();
    }, 15 * 60 * 1000); // 15 minutes

    set({
      accessToken: access,
      refreshToken: refresh,
      tokenTimeout: newTimeout,
      error: null,
    });

    // Fetch user profile after setting tokens
    await get().fetchUserProfile();
  },

  // Clear all authentication data
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenTime");

    const { tokenTimeout } = get();
    if (tokenTimeout) clearTimeout(tokenTimeout);

    set({
      accessToken: null,
      refreshToken: null,
      showRefreshPrompt: false,
      tokenTimeout: null,
      userProfile: null,
      error: null,
    });
  },

  // Initialize state from localStorage
  hydrateTokens: () => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    const accessTokenTime = localStorage.getItem("accessTokenTime");

    if (access && refresh && accessTokenTime) {
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;
      const timeLeft = Number(accessTokenTime) + fifteenMinutes - now;

      if (timeLeft > 0) {
        const timeout = setTimeout(() => {
          get().clearTokens();
        }, timeLeft);
      
        set({
          accessToken: access,
          refreshToken: refresh,
          tokenTimeout: timeout,
        });
      
        get().fetchUserProfile();
      } else {
        get().clearTokens(); // Token expired immediately
      }
    }
  },

  // Fetch user profile from API
  fetchUserProfile: async () => {
    const { accessToken } = get();
    if (!accessToken) return;
    console.log("Fetching user profile with token:", accessToken);

    set({ profileLoading: true, error: null });

    try {
      const response = await axios.get(
        "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/get-user-profile",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      set({
        userProfile: response.data.employee,
        profileLoading: false,
      });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Failed to fetch profile",
        profileLoading: false,
      });

      // Clear tokens if unauthorized
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        get().clearTokens();
      }
    }
  },

  // Logout user (clear both local and server session)
  logout: async () => {
    const { accessToken, clearTokens } = get();

    try {
      // Call backend logout endpoint if available
      if (accessToken) {
        await axios.post(
          "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear all local authentication state
      clearTokens();

      // Optional: Clear any other user-related data
      localStorage.removeItem("userPreferences");
      sessionStorage.clear();
    }
  },

  // Utility functions
  setShowRefreshPrompt: (show) => set({ showRefreshPrompt: show }),
  setTokenTimeout: (timeout) => set({ tokenTimeout: timeout }),
}));

// Optional: Add a function to check auth status
export const isAuthenticated = () => {
  const { accessToken } = useAuthStore.getState();
  return !!accessToken;
};
