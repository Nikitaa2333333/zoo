import React from 'react';

interface BookingWidgetProps {
  litePmsId?: string;
  checkIn?: string;
  checkOut?: string;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ litePmsId, checkIn, checkOut }) => {
  // Помощник для смены формата даты с ГГГГ-ММ-ДД на ДД-ММ-ГГГГ (для LitePMS)
  const formatDateForWidget = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formattedIn = formatDateForWidget(checkIn);
  const formattedOut = formatDateForWidget(checkOut);

  // Используем режим прямой резервации (reservation), чтобы убрать лишние элементы интерфейса LitePMS (шапку, контакты)
  const baseUrl = 'https://litepms.ru/widget/reservation?id=12015&wid=2055';
  let widgetUrl = baseUrl;
  
  if (litePmsId) widgetUrl += `&category_id=${litePmsId}`;
  if (formattedIn) widgetUrl += `&date_in=${formattedIn}`;
  if (formattedOut) widgetUrl += `&date_out=${formattedOut}`;

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
      {/* 
        Мы возвращаем оригинальный виджет LitePMS. 
        Он гарантирует 100% точность в шахматке и поддержку всех условий отеля.
        Кстати, цвет кнопок и шрифты виджета можно настроить в кабинете LitePMS!
      */}
      <iframe
        src={widgetUrl}
        width="100%"
        height="100%"
        style={{ minHeight: '800px', border: 'none' }}
        title="LitePMS Booking Widget"
        className="animate-in fade-in duration-700"
      />
    </div>
  );
};

export default BookingWidget;
