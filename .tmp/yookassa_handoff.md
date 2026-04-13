# Handoff: ЮКасса + LitePMS интеграция

## Что сделано

1. Создан файл `public/api/payment.php` — принимает POST, создаёт платёж в ЮКассе, возвращает `payment_url`
2. Выяснено что LitePMS шлёт postMessage при завершении брони: `{"action":"resize","page":"/widget/complete",...}`

## Что нужно сделать

### Шаг 1 — Вставить реальные ключи в payment.php
Файл: `public/api/payment.php`
Заменить:
- `YOUR_SHOP_ID` → реальный shopId из ЮКассы
- `YOUR_SECRET_KEY` → реальный секретный ключ

### Шаг 2 — Обновить BookingWidget.tsx
Файл: `src/components/BookingWidget.tsx`

Нужно добавить postMessage listener который:
1. Ловит сообщение от litepms.ru с `page === "/widget/complete"`
2. Делает POST на `/api/payment.php`
3. Получает `payment_url` и открывает его в новом окне

Пример кода для добавления в useEffect:

```ts
const handleMessage = async (event: MessageEvent) => {
  if (!event.origin.includes('litepms.ru')) return;
  
  try {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    
    if (data.page === '/widget/complete') {
      const response = await fetch('/api/payment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: '1000.00',
          description: 'Предоплата за бронирование',
          return_url: window.location.href
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.payment_url) {
        window.open(result.payment_url, '_blank');
      }
    }
  } catch (e) {
    console.error('Payment error:', e);
  }
};

window.addEventListener('message', handleMessage);
return () => window.removeEventListener('message', handleMessage);
```

### Шаг 3 — Задеплоить и протестировать
- Закоммитить оба файла в GitHub
- Спринтхост подхватит автоматически
- Протестировать с тестовыми ключами ЮКассы

## Стек
- React + Vite (статика)
- Хостинг: Спринтхост (PHP 8.5 есть)
- Деплой: GitHub → Спринтхост
- LitePMS виджет: `widget_embed.js`, id=12015, wid=2055/2056

## Ключевое открытие
LitePMS шлёт postMessage с `page="/widget/complete"` когда бронь оформлена.
Это триггер для открытия ЮКассы. Перехват работает — проверено в DevTools.

## Файлы проекта
- `src/components/BookingWidget.tsx` — виджет LitePMS
- `src/services/litePmsApi.ts` — API клиент LitePMS
- `public/api/payment.php` — новый файл, бэкенд для ЮКассы
