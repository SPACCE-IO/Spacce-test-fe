// Cookie management utilities
export const setCookie = (name: string, value: string, days?: number) => {
  if (typeof document === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${value}${expires}; path=/`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Token validation utility
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    // Here you would make an API call to validate the token
    // For now, we'll just check if the token exists and has a basic structure
    if (!token || token.length < 10) {
      return false;
    }
    
    // You could also decode JWT here to check expiration
    // const decoded = jwt_decode(token);
    // return decoded.exp > Date.now() / 1000;
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Auth state utilities
export const isAuthenticated = (): boolean => {
  const token = getCookie('userToken') || localStorage.getItem('userToken');
  return !!token;
};

export const getAuthToken = (): string | null => {
  return getCookie('userToken') || localStorage.getItem('userToken');
};

export const clearAuthData = () => {
  deleteCookie('userToken');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userToken');
  }
}; 