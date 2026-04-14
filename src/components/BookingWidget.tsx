import React, { useEffect, useRef } from 'react';

interface BookingWidgetProps {
  checkIn?: string;
  checkOut?: string;
  wid?: string;
  litePmsId?: string;
  litePmsRoomId?: string;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ wid, litePmsId, litePmsRoomId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const finalWid = wid || '2055';

  useEffect(() => {
    if (!containerRef.current) return;

    // Очищаем предыдущий виджет перед вставкой нового
    containerRef.current.innerHTML = '';

    // Сбрасываем хэш LitePMS, чтобы виджет не читал состояние предыдущего номера
    history.replaceState(null, '', window.location.pathname + window.location.search);

    // Контейнер для виджета (требуется LitePMS)
    const div = document.createElement('div');
    div.id = 'litepmsiframe';
    containerRef.current.appendChild(div);

    // Переменные конфигурации
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    const filterParam = litePmsRoomId
      ? `,set_room_id=${litePmsRoomId}`
      : litePmsId ? `,set_cat_id=${litePmsId}` : '';
    configScript.text = `var litepmsembed_id=12015,litepmsembed_wid=${finalWid}${filterParam};`;
    containerRef.current.appendChild(configScript);

    // Основной скрипт виджета
    const widgetScript = document.createElement('script');
    widgetScript.type = 'text/javascript';
    widgetScript.src = 'https://litepms.ru/js/widget_embed.js';
    widgetScript.charset = 'utf-8';
    containerRef.current.appendChild(widgetScript);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [finalWid, litePmsId, litePmsRoomId]);

  return (
    <div className="w-full min-h-[600px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl p-2">
      <div ref={containerRef} className="w-full min-h-[600px]" />
    </div>
  );
};

export default BookingWidget;
