import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, CheckCircle2, Info, ClipboardList, Loader2 } from 'lucide-react';

interface GuestCardFormProps {
  onBack: () => void;
}

// НАСТРОЙКИ ТЕЛЕГРАМ
const TG_TOKEN = '8684643120:AAEw1oqeqf7nQ7wmg_blz9kYD5Y4PAAaTKc'; 
const TG_CHAT_IDS = ['1088570591', '651633018'];

export default function GuestCardForm({ onBack }: GuestCardFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('ownerName');
    const phone = formData.get('ownerPhone');

    if (!name || !phone) {
      setError('Пожалуйста, заполните Имя владельца и Телефон. Эти данные необходимы для связи.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);

    // Собираем все данные для сообщения
    let message = `📋 *НОВАЯ АНКЕТА ГОСТЯ*\n\n`;
    
    const sections = [
      { 
        title: '👤 Владелец и питомец', 
        fields: [
          { label: 'Имя владельца', name: 'ownerName' },
          { label: 'Телефон', name: 'ownerPhone' },
          { label: 'Имя питомца', name: 'petName' },
          { label: 'Вид', name: 'petSpecies' },
          { label: 'Порода', name: 'petBreed' },
          { label: 'Возраст', name: 'petAge' },
          { label: 'Течка (для сук)', name: 'heatCycle' }
        ]
      },
      {
        title: '📅 Детали заезда',
        fields: [
          { label: 'Даты/Время', name: 'dates' },
          { label: 'Срок (дней)', name: 'duration' }
        ]
      },
      {
        title: '🏥 Здоровье',
        fields: [
          { label: 'Визит к вет.', name: 'lastVet' },
          { label: 'Причина', name: 'vetReason' },
          { label: 'Особенности', name: 'healthIssues' }
        ]
      },
      {
        title: '🐕 Поведение',
        fields: [
          { label: 'Выгул', name: 'walkFreq' },
          { label: 'Любит', name: 'likes' },
          { label: 'Не любит', name: 'dislikes' },
          { label: 'К людям', name: 'toPeople' },
          { label: 'К животным', name: 'toAnimals' },
          { label: 'Характер', name: 'character' }
        ]
      },
      {
        title: '🥩 Питание',
        fields: [
          { label: 'Корм', name: 'foodBrand' },
          { label: 'Рацион', name: 'diet' },
          { label: 'График', name: 'feedingSchedule' },
          { label: 'Охрана игрушек', name: 'guardToys' },
          { label: 'Охрана еды', name: 'guardFood' }
        ]
      },
      {
        title: '🛡️ Безопасность',
        fields: [
          { label: 'Агрессия', name: 'aggressive' },
          { label: 'Причины', name: 'aggroReason' },
          { label: 'Кусал ли', name: 'bitten' },
          { label: 'Команды', name: 'commands' }
        ]
      },
      {
        title: '📝 Дополнительно',
        fields: [
          { label: 'Прогулки', name: 'walksNum' },
          { label: 'Откуда узнали', name: 'source' },
          { label: 'Данные для договора', name: 'contractData' }
        ]
      }
    ];

    sections.forEach(section => {
      let sectionData = '';
      section.fields.forEach(f => {
        const val = formData.get(f.name);
        if (val && val !== '') {
          sectionData += `▫️ *${f.label}:* ${val}\n`;
        }
      });
      if (sectionData) {
        message += `*${section.title}*\n${sectionData}\n`;
      }
    });

    try {
      // Отправляем всем админам из списка
      const sendPromises = TG_CHAT_IDS.map(chatId => 
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        })
      );

      const results = await Promise.all(sendPromises);
      const anyFailed = results.some(res => !res.ok);
      
      if (anyFailed) throw new Error('Ошибка отправки одному из получателей');
      
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Не удалось отправить анкету. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-[#99ed36] rounded-full flex items-center justify-center mb-8 shadow-xl"
        >
          <CheckCircle2 size={48} className="text-[#141414]" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Спасибо!</h2>
        <p className="text-stone-500 font-bold mb-10 text-lg">Мы получили вашу анкету и скоро свяжемся с вами.</p>
        <button 
          onClick={onBack}
          className="bg-[#141414] text-white px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-all"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <button onClick={onBack} className="flex items-center gap-2 mb-10 font-bold text-stone-500 hover:text-[#ff7e27] transition-all group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Назад
      </button>

      <div className="mb-12">
        <div className="inline-flex items-center gap-3 bg-[#ff7e27]/10 text-[#ff7e27] px-5 py-2 rounded-full mb-6 border border-[#ff7e27]/20">
          <ClipboardList size={20} />
          <span className="font-black text-sm">Предварительная анкета</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">Карточка гостя</h1>
        <p className="text-xl text-stone-500 font-bold leading-relaxed">
          Пожалуйста, заполните эту анкету максимально подробно. Это поможет нам обеспечить вашему питомцу идеальный уход и комфорт.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 font-bold"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <Info size={20} />
            </div>
            <p className="leading-tight">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        
        {/* РАЗДЕЛ: ОСНОВНАЯ ИНФОРМАЦИЯ */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">1</span>
            Основная информация
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Имя владельца</label>
              <input name="ownerName" type="text" placeholder="Ваше полное имя" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Телефон (WhatsApp)</label>
              <input name="ownerPhone" type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Имя питомца</label>
              <input name="petName" type="text" placeholder="Как зовут любимца" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Вид животного</label>
              <select name="petSpecies" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all appearance-none cursor-pointer">
                <option value="">Выберите вид</option>
                <option value="dog">Собака</option>
                <option value="cat">Кошка</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Порода</label>
              <input name="petBreed" type="text" placeholder="Укажите породу" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Возраст</label>
              <input name="petAge" type="text" placeholder="Например: 3 года и 2 месяца" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Даты последней течки (для сук)</label>
              <input name="heatCycle" type="text" placeholder="Если актуально" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
          </div>
        </div>

        {/* РАЗДЕЛ: ДЕТАЛИ ЗАЕЗДА */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">2</span>
            Детали заезда
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Даты и время заезда/отъезда</label>
              <input name="dates" type="text" placeholder="Укажите период" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Срок пребывания (дней)</label>
              <input name="duration" type="number" placeholder="Количество" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
          </div>
        </div>

        {/* РАЗДЕЛ: ЗДОРОВЬЕ */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">3</span>
            Здоровье
          </h3>
          <div className="grid md:grid-cols-1 gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-black text-stone-700 ml-2">Последний визит к ветеринару</label>
                <input name="lastVet" type="text" placeholder="Когда был визит" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black text-stone-700 ml-2">Причина визита</label>
                <input name="vetReason" type="text" placeholder="Например: вакцинация" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Хронические заболевания и особенности здоровья</label>
              <textarea name="healthIssues" rows={3} placeholder="Опишите все особенности" className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
            </div>
          </div>
        </div>

        {/* РАЗДЕЛ: ПОВЕДЕНИЕ */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">4</span>
            Поведение и привычки
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Частота выгула (для собак)</label>
              <input name="walkFreq" type="text" placeholder="Сколько раз в день гуляете" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-black text-stone-700 ml-2">Что любит? (игры/общение)</label>
                <textarea name="likes" rows={2} placeholder="Любимые чесалки, места и т.д." className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black text-stone-700 ml-2">Что НЕ любит?</label>
                <textarea name="dislikes" rows={2} placeholder="Темноту, агрессию, шум и т.д." className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Отношение к людям</label>
              <input name="toPeople" type="text" placeholder="Дружелюбен, пуглив и др." className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Отношение к другим животным</label>
              <input name="toAnimals" type="text" placeholder="Как ведет себя с другими" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Особенности характера</label>
              <textarea name="character" rows={2} placeholder="Активный, впечатлительный, засыпает только с игрушкой..." className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
            </div>
          </div>
        </div>

        {/* РАЗДЕЛ: ПИТАНИЕ */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">5</span>
            Питание
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Какой корм (название)</label>
              <input name="foodBrand" type="text" placeholder="Марка и тип корма" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Привычный рацион</label>
              <textarea name="diet" rows={2} placeholder="Например: 100г утром, 100г вечером" className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Кормление относительно прогулки</label>
              <select name="feedingSchedule" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all appearance-none cursor-pointer">
                <option value="not-specified">Не принципиально</option>
                <option value="before">До прогулки</option>
                <option value="after">После прогулки</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-black text-stone-700 ml-2">Охраняет ли игрушки?</label>
                <div className="flex gap-4">
                  {['Да', 'Нет'].map(opt => (
                    <label key={opt} className="flex-1 flex items-center justify-center p-4 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-[#99ed36] transition-all font-bold">
                      <input type="radio" name="guardToys" value={opt} className="mr-2 accent-[#99ed36]" /> {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-stone-700 ml-2">Охраняет ли еду?</label>
                <div className="flex gap-4">
                  {['Да', 'Нет'].map(opt => (
                    <label key={opt} className="flex-1 flex items-center justify-center p-4 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-[#99ed36] transition-all font-bold">
                      <input type="radio" name="guardFood" value={opt} className="mr-2 accent-[#99ed36]" /> {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* РАЗДЕЛ: БЕЗОПАСНОСТЬ */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">6</span>
            Безопасность
          </h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-black text-stone-700 ml-2">Бывает ли агрессивен?</label>
              <div className="flex gap-4">
                {['Да', 'Нет'].map(opt => (
                  <label key={opt} className="flex-1 flex items-center justify-center p-4 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-[#99ed36] transition-all font-bold">
                    <input type="radio" name="aggressive" value={opt} className="mr-2 accent-[#99ed36]" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Если да, чем это может быть вызвано?</label>
              <textarea name="aggroReason" rows={2} placeholder="Причины агрессии" className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black text-stone-700 ml-2">Кусал ли когда-нибудь человека?</label>
              <div className="flex gap-4">
                {['Да', 'Нет'].map(opt => (
                  <label key={opt} className="flex-1 flex items-center justify-center p-4 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-[#99ed36] transition-all font-bold">
                    <input type="radio" name="bitten" value={opt} className="mr-2 accent-[#99ed36]" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Знание команд</label>
              <select name="commands" className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all appearance-none cursor-pointer">
                <option value="know-do">Знает и выполняет</option>
                <option value="know-wont">Знает, но не выполняет</option>
                <option value="dont-know">Не знает</option>
              </select>
            </div>
          </div>
        </div>

        {/* РАЗДЕЛ: ДОПОЛНИТЕЛЬНО */}
        <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-[#141414] text-white rounded-lg flex items-center justify-center text-sm">7</span>
            Дополнительно
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Привычное количество прогулок</label>
              <div className="flex gap-3">
                {[2, 3, 4].map(num => (
                  <label key={num} className="flex-1 flex items-center justify-center p-4 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-[#99ed36] transition-all font-bold">
                    <input type="radio" name="walksNum" value={num} className="mr-2 accent-[#99ed36]" /> {num}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Откуда узнали о гостинице?</label>
              <input name="source" type="text" placeholder="Яндекс, друзья, соцсети и т.д." className="w-full bg-white border border-stone-200 rounded-3xl p-5 font-bold outline-none focus:border-[#99ed36] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-stone-700 ml-2">Данные владельца для договора</label>
              <textarea name="contractData" rows={4} placeholder="ФИО полностью, адрес проживания, контактный телефон" className="w-full bg-white border border-stone-200 rounded-3xl p-6 font-bold outline-none focus:border-[#99ed36] transition-all resize-none" />
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#141414] text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-2xl transition-all group disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
            {loading ? 'Отправка...' : 'Отправить анкету'}
          </button>
          <div className="flex items-center justify-center gap-2 mt-6 text-stone-400 font-bold text-sm">
            <Info size={16} />
            Ваши данные будут отправлены напрямую администратору.
          </div>
        </div>
      </form>
    </div>
  );
}
