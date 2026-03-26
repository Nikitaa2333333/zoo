import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Home, Heart, Star, MapPin, Phone, Clock, ChevronRight,
  MessageCircle, ShieldCheck, ArrowLeft, Cat, Dog,
  Camera, Coffee, Thermometer, UserCheck, CheckCircle2,
  Instagram, Send, FileText, Tag, Image as LucideImage, Info, Mail,
  Maximize2, Layers, Check, Sparkles
} from 'lucide-react';
import BookingWidget from './components/BookingWidget';
import { litePmsApi } from './services/litePmsApi';

import logoImg from './assets/logo.png';
import catStandardImg from './assets/rooms/cat_standard.png';
import catImprovedImg from './assets/rooms/cat_improved.png';
import catComfortImg from './assets/rooms/cat_comfort.png';
import dogStandardImg from './assets/rooms/dog_standard.png';
import dogComfortImg from './assets/rooms/dog_comfort.png';
import dogLuxuryImg from './assets/rooms/dog_luxury.png';
import heroSpaImg from './assets/hero_spa.png';
import heroMainImg from './assets/hero_main.png';

const catRooms = [
  {
    title: 'Стандарт',
    image: catStandardImg,
    price: '850 ₽/сут',
    pricePerNight: 850,
    area: '0.8 м²',
    height: '0.8 м',
    includes: 'Индивидуальный уход',
    note: 'Ежедневные фотоотчёты, фильтрованная вода, уборка 2 раза в день и много любви.',
    litePmsId: '75241',
  },
  {
    title: 'Улучшенный',
    image: catImprovedImg,
    price: '1050 ₽/сут',
    pricePerNight: 1050,
    area: '0.8 м²',
    height: '1.3 м',
    includes: 'Доп. полочки для игр',
    note: 'Система ступенек и полочек для активных игр, расширенный уход и внимание няни 24/7.',
    litePmsId: '75240',
  },
  {
    title: 'Комфорт',
    image: catComfortImg,
    price: '1250 ₽/сут',
    pricePerNight: 1250,
    area: '1.12 м²',
    height: '1.3 м',
    includes: 'Видеонаблюдение 24/7',
    note: 'Круглосуточный видеоконтроль, дизайнерская мебель и персональные игры в течение дня.',
    litePmsId: '75242',
  }
];

const dogRooms = [
  {
    title: 'Стандарт',
    image: dogStandardImg,
    price: '1350 ₽/сут',
    pricePerNight: 1350,
    area: '0.8 м²',
    height: '0.9 м',
    includes: '3-разовый выгул',
    note: 'Прогулки на свежем воздухе, гигиенический уход и ежедневные видеоотчёты владельцу.',
  },
  {
    title: 'Улучшенный',
    image: dogComfortImg,
    price: '1690 ₽/сут',
    pricePerNight: 1690,
    area: '0.8 м²',
    height: '1.4 м',
    includes: 'Лежанка, выгул 3 раза/день',
    note: 'Мягкая премиум-лежанка, расширенные прогулки и забота о лапках после улицы.',
  },
  {
    title: 'Комфорт (2 этаж)',
    image: dogComfortImg,
    price: '1890 ₽/сут',
    pricePerNight: 1890,
    area: '1.12 м²',
    height: '1.4 м',
    includes: 'Персональный график',
    note: 'Индивидуальный режим кормления и прогулок, игры с кинологом и полный уют.',
  },
  {
    title: 'Комфорт+ (1 этаж)',
    image: dogComfortImg,
    price: '2190 ₽/сут',
    pricePerNight: 2190,
    area: '1.12 м²',
    height: '1.4 м',
    includes: 'Просторный номер',
    note: 'Идеально для средних пород: много места для движения и 4-разовый активный выгул.',
  },
  {
    title: 'Люкс',
    image: dogLuxuryImg,
    price: '2490 ₽/сут',
    pricePerNight: 2490,
    area: '1.5 м²',
    height: '3 м',
    includes: 'VIP обслуживание',
    note: 'Максимальный простор, видеонаблюдение, SPA-процедуры и безграничное внимание.',
  }
];

const testimonialData = [
  {
    name: "Елена",
    pet: "Кот Марс",
    stayDate: "Март 2024",
    text: "Оставляла кота в номере 'Комфорт' на 2 недели. Очень переживала, как он перенесет разлуку, но благодаря видеонаблюдению видела, что Марс чувствует себя как дома. Вечерние фотоотчеты в Telegram — это просто находка! Вернулся спокойным, чистым и даже не сразу захотел выходить из переноски дома.",
    stars: 5,
  },
  {
    name: "Игорь",
    pet: "Бигль Рокки",
    stayDate: "Февраль 2024",
    text: "Пользовались услугой зоотакси — это мега-удобно! Забрали Рокки прямо от подъезда. В отеле отличные площадки для выгула, пес приехал уставший и счастливый. Понравилось, что за соблюдением правил вакцинации следят строго — это залог безопасности всех животных. Теперь только к вам!",
    stars: 5,
  },
  {
    name: "Мария",
    pet: "Шпиц Буся",
    stayDate: "Январь 2024",
    text: "В 'Бест Френд' работают настоящие профессионалы. У Буси специфический рацион, и я очень просила соблюдать график кормления. Все выполнили идеально. В номере 'Люкс' очень просторно, тепло и чисто. Спасибо няням за терпение и любовь к таким характерным собачкам, как наша!",
    stars: 5,
  },
  {
    name: "Александр",
    pet: "Мейн-кун Цезарь",
    stayDate: "Декабрь 2023",
    text: "Наш кот — настоящий гигант, и обычные гостиницы ему тесноваты. Здесь в номере 'Улучшенный' ему было где развернуться (высота 1.3м!). Полочки — это супер, коты это обожают. Вернулся довольный, шерсть в отличном состоянии. Рекомендую для крупных пород!",
    stars: 5,
  },
  {
    name: "Татьяна",
    pet: "Лабрадор Бадди",
    stayDate: "Ноябрь 2023",
    text: "Искали место с хорошим выгулом, так как Бадди очень активный. Выгул 3 раза в день — это то, что нужно. Персонал знает подход к крупным собакам. Фотоотчеты радовали всю семью во время отпуска. Спасибо за спокойствие за нашего друга!",
    stars: 5,
  },
  {
    name: "Ольга",
    pet: "Британка Луна",
    stayDate: "Октябрь 2023",
    text: "Очень понравился интерьер — современно, без лишних запахов. Луна обычно стрессует в новых местах, но здесь быстро адаптировалась. Няни очень ласковые, видно, что любят животных. Приедем еще!",
    stars: 5,
  }
];

const faqData = [
  { q: "Что нужно взять с собой?", a: "Мы рекомендуем взять привычный корм, лежанку с запахом дома и 1-2 любимые игрушки питомца." },
  { q: "Как я буду узнавать о состоянии питомца?", a: "Мы присылаем ежедневные фото и видеоотчеты в Telegram/WhatsApp, а в номерах Комфорт доступно круглосуточное видеонаблюдение." },
  { q: "Можно ли заказать зоотакси?", a: "Да! Мы заберем вашего друга из любой точки Москвы и привезем обратно в комфортном авто." }
];

const promoData = [
  { 
    title: "Постоянным клиентам", 
    text: "Скидка 5% на все услуги отеля начиная со второго бронирования.", 
    bg: "bg-[#99ed36]", 
    discount: "5%",
    icon: Star,
    note: "Верным друзьям"
  },
  { 
    title: "Длительный отдых", 
    text: "При заезде от 20 дней — скидка 10%, от 30 дней — 15%.", 
    bg: "bg-[#ff7e27]", 
    discount: "до 15%",
    icon: Clock,
    note: "Чем дольше, тем выгоднее"
  },
  { 
    title: "Два хвостика", 
    text: "Скидка 30% на проживание второго питомца в одном номере.", 
    bg: "bg-[#141414]", 
    textWhite: true,
    discount: "30%",
    icon: Heart,
    note: "Заселение вместе"
  }
];

const rulesData = [
  { title: "Ветпаспорт", text: "Обязательное наличие ветеринарного паспорта с актуальными отметками." },
  { title: "Вакцинация", text: "Прививки должны быть сделаны не ранее 12 месяцев и не позднее 14 дней до заезда." },
  { title: "Здоровье", text: "Мы принимаем только клинически здоровых животных без признаков инфекций." },
  { title: "Обработка", text: "Обязательная обработка от внешних и внутренних паразитов (клещи, глисты)." }
];

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop", title: "Уютный котик", span: "md:col-span-1", rotate: -2 },
  { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop", title: "Активные игры", span: "md:col-span-2", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop", title: "Тихий час", span: "md:col-span-1", rotate: 2 },
  { url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop", title: "Стильный гость", span: "md:col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop", title: "Комфортный сон", span: "md:col-span-1", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1592754862816-1a6e7e7ad29d?q=80&w=800&auto=format&fit=crop", title: "Прогулка", span: "md:col-span-2", rotate: 2 },
  { url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop", title: "Любопытство", span: "md:col-span-1", rotate: -2 },
  { url: "https://images.unsplash.com/photo-1554692990-280459345688?q=80&w=800&auto=format&fit=crop", title: "Верный друг", span: "md:col-span-1", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=800&auto=format&fit=crop", title: "Минимализм", span: "md:col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop", title: "Отдых", span: "md:col-span-2", rotate: 2 },
  { url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800&auto=format&fit=crop", title: "Забота", span: "md:col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=800&auto=format&fit=crop", title: "Друзья", span: "md:col-span-1", rotate: 1 },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'booking'>('main');
  const [selectedCategory, setSelectedCategory] = useState<'cats' | 'dogs' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, 1.3]);

  useEffect(() => {
    litePmsApi.getRooms()
      .then(res => {
        if (res.status === 'success' || res.success === 'true') {
          const prices: Record<string, number> = {};
          const rooms = res.data || res.response || [];
          rooms.forEach((r: any) => { prices[r.id] = parseFloat(r.price); });
          setLivePrices(prices);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!checkInDate) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      setCheckInDate(today.toISOString().split('T')[0]);
      setCheckOutDate(tomorrow.toISOString().split('T')[0]);
    }
  }, []);

  const totalDays = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [checkInDate, checkOutDate]);

  const handleBooking = (category: 'cats' | 'dogs', room: any) => {
    setSelectedCategory(category);
    setSelectedRoom(room);
    setCurrentPage('booking');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#141414] font-sans selection:bg-[#99ed36] selection:text-[#141414]">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafaf8]/90 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => { setCurrentPage('main'); window.scrollTo(0, 0); }}>
            <img
              src={logoImg}
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-500"
              alt="Бест Френд"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tighter leading-none">Бест Френд</span>
              <span className="text-[8px] md:text-[10px] tracking-[0.2em] font-bold text-stone-400">Pet Hotel</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 font-bold text-stone-600 text-[15px]">
            <a href="#rooms" className="hover:text-[#99ed36] transition-all">Номера</a>
            <a href="#about" className="hover:text-[#99ed36] transition-all">Команда</a>
            <a href="#contacts" className="hover:text-[#99ed36] transition-all">Контакты</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-[#141414] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg">
              <MessageCircle size={18} />
              Связаться с нами
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-white border-b border-stone-100 overflow-hidden origin-top shadow-2xl"
            >
              <div className="p-8 flex flex-col gap-6">
                {[
                  { name: 'Номера', href: '#rooms' },
                  { name: 'О нас', href: '#about' },
                  { name: 'Правила', href: '#rules' },
                  { name: 'Акции', href: '#promos' },
                  { name: 'Галерея', href: '#gallery' },
                  { name: 'Контакты', href: '#contacts' }
                ].map((item, i) => (
                  <motion.a
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black hover:text-[#ff7e27] transition-colors"
                  >
                    {item.name}
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-stone-100 mt-4 flex flex-col gap-4"
                >
                  <a href="tel:89276159790" className="text-2xl font-black text-[#ff7e27] flex items-center gap-3">
                    <Phone size={24} /> 8 927 615 97 90
                  </a>
                  <p className="text-stone-400 font-bold text-sm">Круглосуточно — Мы на связи</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        {currentPage === 'booking' && selectedRoom ? (
          <motion.div
            key="booking-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-24 md:pt-28 pb-12 md:pb-20 max-w-7xl mx-auto px-4 i md:px-6"
          >
            <button onClick={() => setCurrentPage('main')} className="flex items-center gap-2 mb-8 md:mb-10 font-bold text-stone-500 hover:text-[#ff7e27] transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Назад к выбору
            </button>

            <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-4 space-y-6">
                  <div className={`p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] ${selectedCategory === 'cats' ? 'bg-[#99ed36]' : 'bg-[#ff7e27]'} text-[#141414] shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[600px]`}>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">{selectedRoom.title}</h1>
                        <p className="text-2xl font-black opacity-60 tracking-tight">{selectedRoom.price}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-10">
                        <div className="bg-white/40 backdrop-blur-md p-5 rounded-[2rem] flex flex-col gap-1 border border-white/20">
                          <Layers size={20} className="mb-1 opacity-40" />
                          <span className="text-[10px] font-bold opacity-40">Площадь</span>
                          <span className="text-xl font-black leading-none tracking-tight">{selectedRoom.area}</span>
                        </div>
                        <div className="bg-white/40 backdrop-blur-md p-5 rounded-[2rem] flex flex-col gap-1 border border-white/20">
                          <Maximize2 size={20} className="mb-1 opacity-40" />
                          <span className="text-[10px] font-bold opacity-40">Высота</span>
                          <span className="text-xl font-black leading-none tracking-tight">{selectedRoom.height}</span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-12 flex-1">
                        <p className="text-[11px] font-bold opacity-30 mb-4">В тариф включено:</p>
                        {(selectedRoom.note || selectedRoom.includes).split(',').map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-xl bg-black/10 flex items-center justify-center mt-0.5 shrink-0">
                              <Check size={14} strokeWidth={4} />
                            </div>
                            <span className="font-bold text-sm leading-tight text-[#141414]/80">{item.trim()}</span>
                          </div>
                        ))}
                      </div>

                       <div className="mt-auto pt-8 border-t border-black/10">
                          <div className="text-[10px] font-black mb-2 opacity-40 uppercase">Итого к оплате</div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl md:text-7xl font-black tracking-tighter">{totalDays * (selectedRoom.pricePerNight || 0)}</span>
                            <span className="text-2xl font-black opacity-40">₽</span>
                          </div>
                          <p className="text-xs font-bold opacity-40 mt-1">за {totalDays} суток проживания</p>
                       </div>
                    </div>
                  </div>
                </div>

              <div className="lg:col-span-8">
                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-2 md:p-4 shadow-2xl border border-stone-100 overflow-hidden min-h-[600px] md:min-h-[800px]">
                  <BookingWidget
                    litePmsId={selectedRoom.litePmsId}
                    checkIn={checkInDate}
                    checkOut={checkOutDate}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.main
            key="main-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-20"
          >
            {/* HERO */}
            <section className="relative pt-32 md:pt-40 overflow-hidden bg-white">
              {/* Background Blurs - strictly behind */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[50%] opacity-40 blur-[130px] pointer-events-none z-0 flex items-center justify-center">
                <div className="w-[40%] h-[70%] bg-[#99ed36] rounded-full mx-[-10%]"></div>
                <div className="w-[45%] h-[75%] bg-[#ff7e27] rounded-full mx-[-10%]"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full text-center flex flex-col items-center mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-6xl"
                >
                  <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter text-[#141414]">
                    <span className="text-[#ff7e27]">Бест Френд —</span> <br /> зоотель в&nbsp;Москве
                  </h1>
                  <p className="text-xl md:text-2xl text-stone-500 font-bold mb-12 leading-relaxed">
                    Пятизвездочный курорт для тех, кто ждет вас дома. <br />
                    Профессиональный уход, технологичный уют и забота 24/7.
                  </p>
                  <div className="flex justify-center mb-2">
                    <a href="#rooms" className="bg-[#141414] text-white px-14 py-7 rounded-full font-black text-xl hover:scale-105 hover:bg-[#ff7e27] transition-all shadow-[0_20px_60px_-15px_rgba(255,126,39,0.3)]">
                      Выбрать номер
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Narrower Image with Scroll Scale Effect */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ scale }}
                className="relative z-20 max-w-4xl mx-auto px-4 md:px-6"
              >
                <img
                  src={heroMainImg}
                  alt="Hotel hero"
                  className="w-full h-auto block"
                />
              </motion.div>
            </section>

            {/* ROOMS */}
            <section id="rooms" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Наши номера</h2>
                    <p className="text-lg md:text-xl text-stone-500 font-medium">Подберите идеальный вариант для вашего питомца</p>
                  </div>

                  <div className="bg-stone-100 p-2 rounded-full flex items-center gap-1 self-start">
                    <button
                      onClick={() => setSelectedCategory('cats')}
                      className={`flex items-center px-8 py-4 rounded-full font-black text-sm transition-all ${selectedCategory === 'cats' || !selectedCategory ? 'bg-[#99ed36] shadow-md text-[#141414]' : 'text-stone-400'}`}
                    >
                      <Cat className="w-5 h-5 mr-3" /> Кошки
                    </button>
                    <button
                      onClick={() => setSelectedCategory('dogs')}
                      className={`flex items-center px-8 py-4 rounded-full font-black text-sm transition-all ${selectedCategory === 'dogs' ? 'bg-[#ff7e27] shadow-md text-[#141414]' : 'text-stone-400'}`}
                    >
                      <Dog className="w-5 h-5 mr-3" /> Собаки
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(selectedCategory === 'dogs' ? dogRooms : catRooms).map((room, idx) => (
                    <motion.div
                      key={room.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden flex flex-col h-full"
                    >
                      <div className="h-64 overflow-hidden relative">
                        <img src={room.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={room.title} />
                        <div className={`absolute top-4 right-4 w-10 h-10 ${selectedCategory === 'dogs' ? 'bg-[#ff7e27]' : 'bg-[#99ed36]'} rounded-xl flex items-center justify-center text-black`}>
                          {selectedCategory === 'dogs' ? <Dog size={22} /> : <Cat size={22} />}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-3xl font-black tracking-tight">{room.title}</h4>
                        </div>
                        <p className="text-2xl font-black text-stone-900 mb-8 tracking-tight">{room.price}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-8">
                           <div className="bg-stone-50 p-5 rounded-[1.5rem] flex flex-col gap-1 border border-stone-100/50">
                              <Layers size={18} className="text-stone-300 mb-1" />
                              <span className="text-[10px] font-bold text-stone-400">Площадь</span>
                              <span className="text-lg font-black leading-none">{room.area}</span>
                           </div>
                           <div className="bg-stone-50 p-5 rounded-[1.5rem] flex flex-col gap-1 border border-stone-100/50">
                              <Maximize2 size={18} className="text-stone-300 mb-1" />
                              <span className="text-[10px] font-bold text-stone-400">Высота</span>
                              <span className="text-lg font-black leading-none">{room.height}</span>
                           </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                           <p className="text-[11px] font-bold text-stone-300 mb-2">Что включено:</p>
                           {(room.note || room.includes).split(',').slice(0, 4).map((item: string, i: number) => (
                             <div key={i} className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 ${selectedCategory === 'dogs' ? 'bg-[#ff7e27]/10 text-[#ff7e27]' : 'bg-[#99ed36]/10 text-[#99ed36]'}`}>
                                   <Check size={12} strokeWidth={4} />
                                </div>
                                <span className="text-xs font-bold text-stone-500 leading-snug">{item.trim()}</span>
                             </div>
                           ))}
                        </div>
                        
                        <button 
                          onClick={() => handleBooking(selectedCategory || 'cats', room)} 
                          className={`w-full py-5 rounded-full font-black text-base transition-all bg-[#141414] text-white ${selectedCategory === 'dogs' ? 'hover:bg-[#ff7e27]' : 'hover:bg-[#99ed36]'} shadow-lg hover:shadow-xl active:scale-95 group/btn`}
                        >
                          Забронировать
                          <ChevronRight size={18} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ABOUT US */}
            <section id="about" className="py-24 bg-stone-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="max-w-3xl mb-16">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">Курорт, который <br /><span className="text-[#ff7e27]">они заслужили</span></h2>
                  <p className="text-xl text-stone-500 font-medium leading-relaxed">Бест Френд — это не просто гостиница, а современное пространство для комфортного отдыха ваших питомцев в Москве. Мы объединили инновации и искреннюю любовь к животным.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Camera, title: "Видео 24/7", text: "Круглосуточный видеоконтроль с доступом через приложение.", color: "bg-[#99ed36]" },
                    { icon: LucideImage, title: "Фотоотчёт", text: "Ежедневные фото и видео вашего любимца в мессенджеры.", color: "bg-[#ff7e27]" },
                    { icon: Thermometer, title: "Климат", text: "Теплые полы, очистка воздуха и комфортная температура.", color: "bg-[#99ed36]" },
                    { icon: Heart, title: "Любовь", text: "Профессиональный уход и безграничное внимание 24/7.", color: "bg-[#ff7e27]" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-stone-50 transition-all">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 ${item.color} text-black`}>
                        <item.icon size={28} />
                      </div>
                      <h4 className="text-3xl font-black mb-4">{item.title}</h4>
                      <p className="text-stone-400 font-bold text-lg leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RULES */}
            <section id="rules" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16">Правила заезда</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {rulesData.map((rule, idx) => (
                    <div key={idx} className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 group hover:bg-[#141414] transition-all">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#ff7e27] shadow-sm"><FileText size={24} /></div>
                      <h4 className="text-xl font-black mb-4 group-hover:text-white transition-colors">{rule.title}</h4>
                      <p className="text-stone-500 font-medium leading-relaxed group-hover:text-stone-400 transition-colors">{rule.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 max-w-3xl">
                  <p className="text-xl text-stone-500 font-medium mb-4 leading-relaxed">
                    Вы можете заполнить анкету заранее. Это позволит нам сразу принять вашего друга и заселить его в номер, не теряя времени на формальности при заезде.
                  </p>
                  <a 
                    href="#" 
                    className="text-[#ff7e27] hover:text-[#141414] font-black text-xl transition-all inline-flex items-center gap-1 group"
                  >
                    Заполнить анкету
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </section>

            {/* PROMOTIONS */}
            <section id="promos" className="py-24 bg-stone-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Наши акции</h2>
                    <p className="text-lg md:text-xl text-stone-500 font-medium">Специальные предложения для вашего комфорта и экономии</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {promoData.map((promo, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -10 }}
                      className={`${promo.bg} p-10 rounded-[3rem] shadow-xl relative overflow-hidden group min-h-[360px] flex flex-col justify-start border border-black/5`}
                    >
                      {/* Decorative elements */}
                      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${promo.textWhite ? 'bg-white' : 'bg-black'}`}></div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${promo.textWhite ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                            <promo.icon size={28} />
                          </div>
                          <div className={`px-4 py-2 rounded-full font-bold text-sm ${promo.textWhite ? 'bg-white/20 text-white' : 'bg-black/10 text-black'}`}>
                            {promo.note}
                          </div>
                        </div>

                        <div className="mb-auto">
                          <h4 className={`text-3xl md:text-4xl font-black mb-3 leading-tight tracking-tighter ${promo.textWhite ? 'text-white' : 'text-[#141414]'}`}>
                            {promo.title}
                          </h4>
                          <p className={`font-bold text-lg leading-snug ${promo.textWhite ? 'text-white/60' : 'text-[#141414]/60'}`}>
                            {promo.text}
                          </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-black/5 flex items-end justify-between font-black">
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold opacity-40 ${promo.textWhite ? 'text-white' : 'text-black'}`}>Ваша выгода</span>
                            <span className={`text-6xl md:text-7xl tracking-tighter ${promo.textWhite ? 'text-white' : 'text-black'}`}>
                              {promo.discount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section id="gallery" className="py-24 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Жизнь в отеле</h2>
                  <p className="text-stone-400 font-bold">Спокойствие и радость в каждом кадре</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 md:grid-flow-row-dense">
                  {galleryImages.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      style={{ rotate: img.rotate }}
                      className={`rounded-[2.5rem] overflow-hidden shadow-2xl relative ${img.span || 'md:col-span-1'}`}
                    >
                      <motion.img 
                        src={img.url} 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-80 md:h-[450px] object-cover" 
                        alt={img.title} 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 bg-stone-50">
              <div className="max-w-3xl mx-auto px-4 md:px-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16 text-center">Остались вопросы?</h2>
                <div className="space-y-4">
                  {faqData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full p-8 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-xl font-black">{item.q}</span>
                        <ChevronRight className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-8 pb-8 text-stone-500 font-bold text-lg leading-relaxed"
                          >
                            {item.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section id="reviews" className="py-24 bg-stone-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16 text-center">Отзывы</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonialData.slice(0, visibleReviews).map((t, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                      <div className="flex justify-between mb-4">
                        <div className="flex gap-1 text-[#ff7e27]">
                          {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="#ff7e27" />)}
                        </div>
                        <span className="text-[11px] font-bold text-stone-300">{t.stayDate}</span>
                      </div>
                      <p className="text-base font-bold leading-relaxed mb-8 text-stone-700">"{t.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#99ed36]/10 flex items-center justify-center text-[#99ed36]">
                          {t.pet.includes('Кот') ? <Cat size={20} /> : <Dog size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-base leading-none mb-1">{t.name}</p>
                          <p className="text-stone-400 font-bold text-[10px]">{t.pet}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTACTS */}
            <section id="contacts" className="py-24 bg-[#141414] text-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <h2 className="text-5xl md:text-7xl font-black mb-12">Контакты</h2>
                    <div className="space-y-12">
                      <div>
                        <p className="text-stone-500 text-[11px] font-bold mb-3">Адрес</p>
                        <p className="text-3xl font-bold">Москва, Красного Маяка, 16</p>
                      </div>
                      <div>
                        <p className="text-stone-500 text-[11px] font-bold mb-3">Телефон</p>
                        <p className="text-5xl font-black whitespace-nowrap text-[#ff7e27]">8 927 615 97 90</p>
                      </div>

                      <div className="pt-12 border-t border-white/5">
                        <h2 className="text-3xl font-black mb-4">Написать нам</h2>
                        <p className="text-stone-500 font-bold mb-8">Мы ответим в течение 15 минут</p>
                        <div className="space-y-4">
                          <a href="https://t.me/MAX_CONTACT" className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl hover:bg-[#99ed36] hover:text-black transition-all group">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black">M</div>
                            <span className="text-xl font-bold">MAX</span>
                          </a>
                          <a href="https://t.me/best_friend_hotel" className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl hover:bg-[#24A1DE] transition-all group">
                            <Send size={24} />
                            <span className="text-xl font-bold">Telegram</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 h-[600px] md:h-[800px] rounded-[4rem] overflow-hidden grayscale-0 hover:grayscale-0 transition-all duration-700 shadow-2xl">
                    <iframe src="https://yandex.ru/map-widget/v1/?ll=37.595460%2C55.611181&z=15" width="100%" height="100%" frameBorder="0"></iframe>
                  </div>
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="py-20 bg-[#141414] text-stone-500 border-t border-white/5 text-center">
        <img src={logoImg} className="w-16 h-16 mx-auto opacity-20 filter grayscale mb-8" alt="Logo" />
        <p className="font-bold text-sm mb-4">© 2026 Бест Френд — Зоотель</p>
        <div className="flex justify-center gap-8 text-xs font-medium opacity-40">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Публичная оферта</a>
        </div>
      </footer>
    </div>
  );
}
