import { Cookies } from 'next-client-cookies';

let cookies: Cookies | null = null;

// Client cookies'i ayarla
export const setCookiesClient = (cookiesClient: Cookies) => {
  cookies = cookiesClient;
};

// Token için kullanılacak key'ler
const TOKEN_KEY = 'token';

// Cookie ayarları
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 gün
  sameSite: 'strict'
};

// Token'ı kaydet (hem localStorage hem cookie'ye)
export const saveToken = (token: string) => {
  try {
    // LocalStorage'a kaydet
    localStorage.setItem(TOKEN_KEY, token);
    
    // Cookie'ye kaydet
    document.cookie = `${TOKEN_KEY}=${token}; path=${COOKIE_OPTIONS.path}; max-age=${COOKIE_OPTIONS.maxAge}; samesite=${COOKIE_OPTIONS.sameSite}`;
    
    return true;
  } catch (error) {
    console.error('Token kaydedilirken hata:', error);
    return false;
  }
};

// Token'ı getir (önce localStorage, yoksa cookie'den)
export const getToken = (): string | null => {
  try {
    // Önce localStorage'dan dene
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) return localToken;

    // localStorage'da yoksa cookie'den dene
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith(`${TOKEN_KEY}=`));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      // Cookie'den token alındıysa, localStorage'a da kaydedelim (senkronizasyon)
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('Token alınırken hata:', error);
    return null;
  }
};

// Token'ı sil (hem localStorage hem cookie'den)
export const removeToken = () => {
  try {
    // LocalStorage'dan sil
    localStorage.removeItem(TOKEN_KEY);
    
    // Cookie'den sil
    document.cookie = `${TOKEN_KEY}=; path=${COOKIE_OPTIONS.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    return true;
  } catch (error) {
    console.error('Token silinirken hata:', error);
    return false;
  }
};

// Token var mı kontrol et
export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 