import { useAuthStore } from '@/store/authStore';

// Re-export auth store as a hook for convenience
const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, login, register, logout, clearError } = useAuthStore();
  return { user, token, isAuthenticated, isLoading, error, login, register, logout, clearError };
};

export default useAuth;
