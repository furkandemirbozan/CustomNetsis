import axios from 'axios';

// Proxy kullanarak CORS hatalarını önlüyoruz
const BASE_URL = '/api/v2';

// Token alma isteği
export const fetchToken = async (username: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    formData.append('branchCode', '0');
    formData.append('dbType', '0');
    formData.append('dbName', 'KENANSB');
    formData.append('dbUser', 'TEMELSET');
    formData.append('dbPassword', '');

    console.log('Token API isteği yapılıyor:', `${BASE_URL}/token`);
    console.log('Gönderilen form data:', formData.toString());
    
    const response = await axios.post(`${BASE_URL}/token`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Token API yanıtı status:', response.status);
    console.log('Token API yanıtı özeti:', {
      access_token: response.data?.access_token ? `${response.data.access_token.substring(0, 20)}...` : undefined,
      token_type: response.data?.token_type,
      expires_in: response.data?.expires_in
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Token alınırken hata oluştu:');
    
    if (error.response) {
      // Sunucudan gelen yanıtla ilgili hata
      console.error('Sunucu yanıtı:', error.response.status, error.response.data);
    } else if (error.request) {
      // İstek yapıldı ancak yanıt alınamadı
      console.error('Yanıt alınamadı. İstek:', error.request);
    } else {
      // İstek yapılırken bir hata oluştu
      console.error('İstek hatası:', error.message);
    }
    
    throw error;
  }
};

// Cari bilgilerini alma isteği
export const fetchArps = async (token: string) => {
  try {
    console.log('Cari API isteği yapılıyor:', `${BASE_URL}/arps`);
    
    const response = await axios.get(`${BASE_URL}/arps`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Cari API yanıtı status:', response.status);
    console.log('Cari API yanıtı özeti:', {
      TotalCount: response.data?.TotalCount,
      Limit: response.data?.Limit,
      Offset: response.data?.Offset,
      IsSuccessful: response.data?.IsSuccessful,
      DataLength: response.data?.Data?.length || 0
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Cari bilgileri alınırken hata oluştu:');
    
    if (error.response) {
      // Sunucudan gelen yanıtla ilgili hata
      console.error('Sunucu yanıtı:', error.response.status, error.response.data);
    } else if (error.request) {
      // İstek yapıldı ancak yanıt alınamadı
      console.error('Yanıt alınamadı. İstek:', error.request);
    } else {
      // İstek yapılırken bir hata oluştu
      console.error('İstek hatası:', error.message);
    }
    
    throw error;
  }
}; 