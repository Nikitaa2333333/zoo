import React, { useEffect, useRef } from 'react';

interface BookingWidgetProps {
  wid?: string;
  litePmsId?: string;
  litePmsRoomId?: string;
  checkIn?: string;  // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ wid, litePmsId, litePmsRoomId, checkIn, checkOut }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const finalWid = wid || '2055';

  const formatForHash = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    // Set date hash BEFORE loading the script so LitePMS widget reads it
    if (checkIn && checkOut) {
      window.location.hash = `date_in=${formatForHash(checkIn)}&date_out=${formatForHash(checkOut)}`;
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const div = document.createElement('div');
    div.id = 'litepmsiframe';
    containerRef.current.appendChild(div);

    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    const filterParam = litePmsRoomId
      ? `,set_room_id=${litePmsRoomId}`
      : litePmsId ? `,set_cat_id=${litePmsId}` : '';
    configScript.text = `var litepmsembed_id=12015,litepmsembed_wid=${finalWid}${filterParam};`;
    containerRef.current.appendChild(configScript);

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
  }, [finalWid, litePmsId, litePmsRoomId, checkIn, checkOut]);

  return (
    <div className="w-full min-h-[600px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl p-2">
      <div ref={containerRef} className="w-full min-h-[600px]" />
    </div>
  );
};

export default BookingWidget;
