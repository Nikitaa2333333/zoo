import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  startDate: string;
  endDate: string;
  onRangeChange: (start: string, end: string) => void;
  accentColor?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ startDate, endDate, onRangeChange, accentColor = "#99ed36" }) => {
  const [viewDate, setViewDate] = useState(new Date(startDate || Date.now()));
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDayClick = (dayStr: string) => {
    if (!startDate || (startDate && endDate)) {
      onRangeChange(dayStr, '');
    } else {
      if (new Date(dayStr) < new Date(startDate)) {
        onRangeChange(dayStr, '');
      } else {
        onRangeChange(startDate, dayStr);
      }
    }
  };

  const isSelected = (dayStr: string) => dayStr === startDate || dayStr === endDate;
  const isInRange = (dayStr: string) => {
    if (!startDate || !endDate) return false;
    const d = new Date(dayStr);
    return d > new Date(startDate) && d < new Date(endDate);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = (firstDayOfMonth(year, month) + 6) % 7; // Adjust for Monday start

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="bg-white border border-stone-100 rounded-[2rem] p-6 shadow-xl w-full max-w-[340px] select-none">
      <div className="flex justify-between items-center mb-6 px-2">
        <h4 className="font-bold text-[#141414] text-lg">
          {monthNames[month]} {year}
        </h4>
        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-stone-500" />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5 text-stone-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-stone-300 uppercase tracking-widest py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dayStr = formatDate(year, month, day);
          const selected = isSelected(dayStr);
          const inRange = isInRange(dayStr);
          const isToday = dayStr === new Date().toISOString().split('T')[0];

          return (
            <div
              key={dayStr}
              onClick={() => handleDayClick(dayStr)}
              className={`
                relative h-11 flex items-center justify-center cursor-pointer rounded-xl font-bold transition-all text-sm
                ${selected ? 'text-[#141414]' : 'text-[#141414] hover:bg-stone-100'}
                ${inRange ? 'bg-stone-50' : ''}
              `}
              style={selected ? { backgroundColor: accentColor } : {}}
            >
              {day}
              {isToday && !selected && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#ff7e27]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomDatePicker;
