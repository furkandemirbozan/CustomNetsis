'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { fetchToken } from '../services/api';
import { saveToken } from '../utils/auth';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      username: 'Furkan',
      password: 'Fd123456'
    }
  });

  // Check for stored theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleNavigation = () => {
    // Use router.push instead of window.location.href to ensure React context is maintained
    router.push('/dashboard');
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Login isteği gönderiliyor:', data);
      
      try {
        const formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('branchCode', '0');
        formData.append('dbType', '0');
        formData.append('dbName', 'KENANSB');
        formData.append('dbUser', 'TEMELSET');
        formData.append('dbPassword', '');
        
        console.log('Form data oluşturuldu');
        console.log('Yerel API URL:', '/api/token');
  
        const localResponse = await fetch('/api/token', {
          method: 'POST',
          body: formData,
        });
  
        if (localResponse.ok) {
          const localData = await localResponse.json();
          console.log('Yerel API yanıtı:', localData);
          
          if (localData && localData.access_token) {
            console.log('Token alındı:', localData.access_token);
            
            // Token'ı kaydet ve yönlendirmeyi başlat
            localStorage.setItem('token', localData.access_token);
            console.log('Token başarıyla kaydedildi, yönlendirme başlatılıyor...');
            
            // Save theme preference to carry over to dashboard
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Kısa bir gecikme ile yönlendirme yapalım, localStorage'ın güncellenmesini beklemek için
            setTimeout(() => {
              handleNavigation();
            }, 100);
            
            return;
          }
        } else {
          console.log('Yerel API yanıtı başarısız:', localResponse.status, await localResponse.text());
        }
      } catch (localErr) {
        console.error('Yerel API hatası:', localErr);
      }

      console.log('Normal servis üzerinden token isteği yapılıyor...');
      const response = await fetchToken(data.username, data.password);
      
      console.log('Normal API yanıtı:', response);
      
      if (response && response.access_token) {
        console.log('Token alındı:', response.access_token);
        localStorage.setItem('token', response.access_token);
        console.log('Token başarıyla kaydedildi, yönlendirme başlatılıyor...');
        
        // Save theme preference to carry over to dashboard
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Kısa bir gecikme ile yönlendirme yapalım, localStorage'ın güncellenmesini beklemek için
        setTimeout(() => {
          handleNavigation();
        }, 100);
      } else {
        console.log('Token alınamadı, response:', response);
        setError('Token alınamadı. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Login hatası detayı:', err);
      setError('Giriş yapılırken bir hata oluştu. Lütfen kullanıcı adı ve şifrenizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-md p-8 space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <div className="text-center">
            <h1 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Giriş Yap</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>API Entegrasyon Uygulaması</p>
          </div>
          
          {error && (
            <div className={`p-4 text-sm ${isDarkMode ? 'text-red-300 bg-red-900 border-red-800' : 'text-red-700 bg-red-100'} rounded-md`}>
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="username" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username', { required: 'Kullanıcı adı gerekli' })}
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Şifre
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Şifre gerekli' })}
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer - Sticky at bottom */}
      <footer className={`border-t ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-sm hover:underline">Hakkımızda</a>
              <a href="#" className="text-sm hover:underline">Gizlilik Politikası</a>
              <a href="#" className="text-sm hover:underline">Yardım</a>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Netsis Rest API. Tüm hakları saklıdır.
            </p>
            <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              API entegrasyonlarında güvenilir çözüm ortağınız.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 