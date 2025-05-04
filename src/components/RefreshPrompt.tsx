import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import axios from 'axios';

const RefreshPrompt = () => {
  const showPrompt = useAuthStore((s) => s.showRefreshPrompt);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setShowPrompt = useAuthStore((s) => s.setShowRefreshPrompt);
  const clearTokens = useAuthStore((s) => s.clearTokens);

  const handleRefresh = async () => {
    try {
      const response = await axios.post('https://yourdomain.com/api/refresh', {
        refreshToken,
      });
      const { accessToken } = response.data;
      setTokens(accessToken, refreshToken!);
      setShowPrompt(false);
    } catch (error) {
      alert('Session expired. Please login again.');
      clearTokens();
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>Session Refresh</h4>
        <p>Your session is about to expire. Do you want to refresh it?</p>
        <button onClick={handleRefresh}>Refresh</button>
        <button onClick={() => clearTokens()}>Logout</button>
      </div>
    </div>
  );
};

export default RefreshPrompt;
