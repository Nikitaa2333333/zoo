/**
 * Сервис для взаимодействия с LitePMS API (версия 1.1.0)
 * Используем fetch для совместимости.
 */

const LOGIN = 'chendev2003';
const HASH = 'e701dc0e67b98171a626b977f5f3c75d';

// Используем внутренний прокси Vite (/litepms-api), настроенный в vite.config.ts.

const fetchWithAuth = async (methodName: string, data: any = {}, method: 'GET' | 'POST' = 'GET') => {
  // Запрос идет на наш же сервер, а Vite перенаправит его на litepms.ru
  const url = new URL(`${window.location.origin}/litepms-api${methodName}`);
  
  // Авторизационные параметры
  url.searchParams.append('login', LOGIN);
  url.searchParams.append('hash', HASH);

  const options: RequestInit = {
    method: method,
    headers: {
      'Accept': 'application/json'
    }
  };

  if (method === 'POST') {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, String(data[key]));
      }
    });
    options.body = formData;
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  } else {
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        url.searchParams.append(key, String(data[key]));
      }
    });
  }

  const response = await fetch(url.toString(), options);
  
  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

export const litePmsApi = {
  getHotelInfo: () => fetchWithAuth('/getHotelInfo'),
  getBookingFields: () => fetchWithAuth('/getBookingFields'),
  getRooms: () => fetchWithAuth('/getRooms'),
  searchBooking: (params: any) => fetchWithAuth('/searchBooking', params),
  // Важно: создание брони требует POST
  createBooking: (bookingData: any) => fetchWithAuth('/createBooking', bookingData, 'POST'),
  getTerms: (type: string) => fetchWithAuth('/getTerms', { type })
};
