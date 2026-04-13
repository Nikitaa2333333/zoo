/**
 * Сервис для взаимодействия с LitePMS API
 *
 * В dev-режиме (npm run dev) → Vite-прокси /litepms-api → litepms.ru
 * В продакшне → PHP-прокси /api/litepms-proxy.php → litepms.ru
 */

const LOGIN = 'chendev2003';
const HASH = 'e701dc0e67b98171a626b977f5f3c75d';

const isDev = import.meta.env.DEV;

const buildUrl = (methodName: string, params: Record<string, string> = {}): string => {
  // В dev: /litepms-api/getRooms → Vite проксирует
  // В prod: /api/litepms-proxy.php?method=getRooms → PHP проксирует
  const url = isDev
    ? new URL(`${window.location.origin}/litepms-api${methodName}`)
    : new URL(`${window.location.origin}/api/litepms-proxy.php`);

  url.searchParams.append('login', LOGIN);
  url.searchParams.append('hash', HASH);

  if (!isDev) {
    // PHP-прокси принимает имя метода как параметр
    url.searchParams.append('method', methodName.replace('/', ''));
  }

  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  return url.toString();
};

const fetchWithAuth = async (methodName: string, data: any = {}, method: 'GET' | 'POST' = 'GET') => {
  const options: RequestInit = {
    method,
    headers: { 'Accept': 'application/json' },
  };

  let url: string;

  if (method === 'POST') {
    url = buildUrl(methodName);
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, String(v));
    });
    options.body = formData;
    (options.headers as Record<string, string>)['Content-Type'] = 'application/x-www-form-urlencoded';
  } else {
    url = buildUrl(methodName, data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const litePmsApi = {
  getHotelInfo:    ()           => fetchWithAuth('/getHotelInfo'),
  getBookingFields: ()          => fetchWithAuth('/getBookingFields'),
  getRooms:        ()           => fetchWithAuth('/getRooms'),
  searchBooking:   (params: any)=> fetchWithAuth('/searchBooking', params),
  createBooking:   (data: any)  => fetchWithAuth('/createBooking', data, 'POST'),
  getTerms:        (type: string)=> fetchWithAuth('/getTerms', { type }),
};
