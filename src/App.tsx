import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Home, Heart, Star, MapPin, Phone, Clock, ChevronRight,
  MessageCircle, ShieldCheck, ArrowLeft, Cat, Dog,
  Camera, Coffee, Thermometer, UserCheck, CheckCircle2,
  Instagram, Send, FileText, Tag, Image as LucideImage, Info, Mail,
  Maximize2, Layers, Check, Sparkles, Car, 
  AlertTriangle, XCircle, Syringe, Verified
} from 'lucide-react';
import BookingWidget from './components/BookingWidget';
import { litePmsApi } from './services/litePmsApi';

import logoImg from './assets/logo.webp';
import catStandardImg from './assets/rooms/cat_standard.webp';
import catImprovedImg from './assets/rooms/cat_improved.webp';
import catComfortImg from './assets/rooms/cat_comfort.webp';
import dogStandardImg from './assets/rooms/dog_standard.webp';
import dogComfortImg from './assets/rooms/dog_comfort.webp';
import dogLuxuryImg from './assets/rooms/dog_luxury.webp';
import heroSpaImg from './assets/hero_spa.webp';
import heroMainImg from './assets/hero_main.webp';
import logoMaxImg from './assets/logo_max.svg';
import telegramLogoImg from './assets/telegram_logo.webp';
import dogRulesImg from './assets/dog_rules.webp';

const catRooms = [
  {
    title: 'Стандарт',
    image: catStandardImg,
    price: '850 ₽/сут',
    pricePerNight: 850,
    area: '0.8 м²',
    height: '0.8 м',
    inclusions: ["Миски", "Лежанка", "Когтеточка", "Лоток", "Наполнитель (древесный)", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Игровая зона"],
    note: 'Для 1-ой кошки',
    extras: ["Поилка-фонтанчик +100 ₽/сут", "Свежая травка +50 ₽/сут", "Наполнитель селикагель +60 ₽/сут", "Активный выгул 20 мин +250 ₽/сут"],
    litePmsId: '75241',
  },
  {
    title: 'Улучшенный',
    image: catImprovedImg,
    price: '1050 ₽/сут',
    pricePerNight: 1050,
    area: '0.8 м²',
    height: '1.3 м',
    inclusions: ["Миски", "Лежанка", "Когтеточка", "Лоток", "Наполнитель (древесный)", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Игровая зона"],
    note: 'Можно поселить 2-х кошек (+30% к стоимости)',
    extras: ["Поилка-фонтанчик +100 ₽/сут", "Свежая травка +50 ₽/сут", "Наполнитель селикагель +60 ₽/сут", "Активный выгул 20 мин +250 ₽/сут"],
    litePmsId: '75240',
  },
  {
    title: 'Комфорт',
    image: catComfortImg,
    price: '1250 ₽/сут',
    pricePerNight: 1250,
    area: '1.12 м²',
    height: '1.3 м',
    inclusions: ["Миски", "Лежанка", "Когтеточка", "Лоток", "Наполнитель (древесный)", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Игровая зона"],
    note: 'Можно поселить 2-х кошек (+30% к стоимости)',
    extras: ["Поилка-фонтанчик +100 ₽/сут", "Свежая травка +50 ₽/сут", "Наполнитель селикагель +60 ₽/сут", "Активный выгул 20 мин +250 ₽/сут"],
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
    inclusions: ["Миски", "Лежанка", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Одноразовые пеленки"],
    note: 'Декоративные породы собак до 5 кг',
    extras: ["Активный выгул 20 мин +250 ₽/выгул"],
  },
  {
    title: 'Улучшенный',
    image: dogComfortImg,
    price: '1690 ₽/сут',
    pricePerNight: 1690,
    area: '0.8 м²',
    height: '1.4 м',
    inclusions: ["Миски", "Лежанка", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Полотенце", "Гигиенический выгул 2 раза/день", "Мытье лап"],
    note: 'Малые породы собак до 10 кг',
    extras: ["Активный выгул 20 мин +250 ₽/выгул"],
  },
  {
    title: 'Комфорт (2 этаж)',
    image: dogComfortImg,
    price: '1890 ₽/сут',
    pricePerNight: 1890,
    area: '1.12 м²',
    height: '1.4 м',
    inclusions: ["Миски", "Лежанка", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Полотенце", "Гигиенический выгул 2 раза/день", "Мытье лап"],
    note: 'До 10 кг. Можно поселить 2-х собак (+500 ₽ за 2-ого)',
    extras: ["Активный выгул 20 мин +250 ₽/выгул"],
  },
  {
    title: 'Комфорт+ (1 этаж)',
    image: dogComfortImg,
    price: '2190 ₽/сут',
    pricePerNight: 2190,
    area: '1.12 м²',
    height: '1.4 м',
    inclusions: ["Миски", "Лежанка", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Полотенце", "Гигиенический выгул 2 раза/день", "Мытье лап"],
    note: 'Средние породы до 20 кг. Можно поселить 2-х собак (+500 ₽ за 2-ого)',
    extras: ["Активный выгул 20 мин +250 ₽/выгул"],
  },
  {
    title: 'Люкс',
    image: dogLuxuryImg,
    price: '2490 ₽/сут',
    pricePerNight: 2490,
    area: '1.7 м²',
    height: '3 м',
    inclusions: ["Миски", "Лежанка", "Питьевая вода", "Кормление по графику", "Индивидуальная вентиляция", "Фото/видео-отчет", "Полотенце", "Гигиенический выгул 2 раза/день", "Мытье лап"],
    note: 'Средние породы до 20 кг. Можно поселить 2-х собак (+500 ₽ за 2-ого)',
    extras: ["Активный выгул 20 мин +250 ₽/выгул"],
  }
];

const testimonialData = [
  {
    name: "Елена",
    pet: "Кот Марс",
    type: "cat",
    stayDate: "Январь 2026",
    text: "Оставляла кота в номере «Комфорт» на 2 недели. Очень переживала, как он перенесет разлуку, но благодаря видеонаблюдению видела, что Марс чувствует себя как дома. Вечерние фотоотчеты в Telegram — это просто находка! Вернулся спокойным, чистым и даже не сразу захотел выходить из переноски дома.",
    stars: 5,
  },
  {
    name: "Игорь",
    pet: "Бигль Рокки",
    type: "dog",
    stayDate: "Декабрь 2025",
    text: "Пользовались услугой зоотакси — это мега-удобно! Забрали Рокки прямо от подъезда. В отеле отличные площадки для выгула, пес приехал уставший и счастливый. Понравилось, что за соблюдением правил вакцинации следят строго — это залог безопасности всех животных. Теперь только к вам!",
    stars: 5,
  },
  {
    name: "Мария",
    pet: "Шпиц Буся",
    type: "dog",
    stayDate: "Ноябрь 2025",
    text: "В «Бест Френд» работают настоящие профессионалы. У Буси специфический рацион, и я очень просила соблюдать график кормления. Все выполнили идеально. В номере «Люкс» очень просторно, тепло и чисто. Спасибо няням за терпение и любовь к таким характерным собачкам, как наша!",
    stars: 4,
  },
  {
    name: "Александр",
    pet: "Мейн-кун Цезарь",
    type: "cat",
    stayDate: "Октябрь 2025",
    text: "Наш кот — настоящий гигант, и обычные гостиницы ему тесноваты. Здесь в номере «Улучшенный» ему было где развернуться (высота 1.3м!). Полочки — это супер, коты это обожают. Вернулся довольный, шерсть в отличном состоянии. Рекомендую для крупных пород!",
    stars: 5,
  },
  {
    name: "Татьяна",
    pet: "Лабрадор Бадди",
    type: "dog",
    stayDate: "Август — сентябрь 2025",
    text: "Искали место с хорошим выгулом, так как Бадди очень активный. Выгул 3 раза в день — это то, что нужно. Персонал знает подход к крупным собакам. Фотоотчеты радовали всю семью во время отпуска. Спасибо за спокойствие за нашего друга!",
    stars: 4,
  },
  {
    name: "Ольга",
    pet: "Британка Луна",
    type: "cat",
    stayDate: "Июль 2025",
    text: "Очень понравился интерьер — современно, без лишних запахов. Луна обычно стрессует в новых местах, но здесь быстро адаптировалась. Няни очень ласковые, видно, что любят животных. Приедем еще!",
    stars: 5,
  },
  {
    name: "Дмитрий",
    pet: "Хаски Гром",
    type: "dog",
    stayDate: "Май 2025",
    text: "Огромное спасибо за профессионализм! Гром — парень с характером, но няни нашли к нему подход. Номер «Люкс» оправдал все ожидания. Рекомендую всем, кто ищет качественное зоопроживание.",
    stars: 5,
  },
  {
    name: "Анна",
    pet: "Бенгалка Симба",
    type: "cat",
    stayDate: "Апрель 2025",
    text: "В «Бест Френд» лучшие условия для кошек. Чисто, тихо и очень уютно.",
    stars: 4,
  }
];

const faqData = [
  { q: "Можно привезти питомца ночью или рано утром?", a: "Мы работаем с 10:00 до 21:00 без обеда и выходных. Заезд и выезд возможен в любое удобное для вас время в рамках рабочего графика. Услуги раннего или позднего заезда/выезда вне рабочего времени могут быть предоставлены по согласованию с администратором за дополнительную плату" },
  { q: "Где выгуливаете собак?", a: "Гостинница расположена в непосредственной близости от парка «Кузьминки». Выгул осуществляется на территории лесопарковой зоны  При заселении учитываем все ваши пожелания по выгулу и прописываем их в договоре, по вашему усмотрению находим компанию питомцу в одной весовой категории или гуляем индивидуально, если Ваш питомец не дружит с другими собаками." },
  { q: "Можно заселиться без прививок?", a: "Нет.  Мы принимаем питомцев только старше 4-х месячного возраста и с полным комплексом ежегодных действующих прививок." },
  { q: "Можно оставить питомца на несколько часов?", a: "Да. При наличии свободных номеров есть возможность кратковременного пребывания (до 5-ти часов). Стоимость - 50% от базовой цены номера за 1 сутки. При пребывании свыше 5-ти часов без ночевки, оплачивается стоимость номера за полные сутки" },
  { q: "Как проводится уборка номера?", a: "В каждом из номеров производится уборка дважды в день. После освобождения номера осуществляется антибактериальная обработка и кварцевание." },
  { q: "Могу приехать и посмотреть гостиницу перед тем, как бронировать?", a: "Да.  Необходимо заранее согласовать время визита по телефону или в мессенджерах, чтобы приехать и посмотреть помещение гостиницы." },
  { q: "Есть ли камеры видеонаблюдения в гостинице?", a: "Да. В отеле  ведётся внутреннее видеонаблюдение для обеспечения максимальной безопасности всех животных. Мы бесплатно предоставляем вам доступ к онлайн-камерам в режиме 24/7. Вы можете в любой момент убедиться, что с вашим любимцем всё в порядке." }
];

const promoData = [
  { 
    title: "Постоянным клиентам", 
    text: "Постоянная скидка 10% на все услуги отеля, действующая с 6-ого бронирования.", 
    bg: "bg-[#99ed36]", 
    discount: "10%",
    icon: Star,
    note: "Верным друзьям"
  },
  { 
    title: "От срока размещения", 
    text: "При проживании свыше 14 дней — скидка 10%, свыше 30 дней — 20%.", 
    bg: "bg-[#ff7e27]", 
    discount: "до 20%",
    icon: Clock,
    note: "Чем дольше, тем выгоднее"
  },
  { 
    title: "Приведи друга", 
    text: "Разовая скидка 10% на следующее бронирование за каждого приведенного нового клиента.", 
    bg: "bg-[#141414]", 
    textWhite: true,
    discount: "10%",
    icon: UserCheck,
    note: "Растем вместе"
  }
];


const rulesSections = {
  main: [
    {
      title: "Кого мы принимаем",
      icon: "Dog",
      content: "Мы принимаем кошек, собак (до 20 кг) старше 4-х месячного возраста, приученных к лотку/пеленке/выгулу."
    },
    {
      title: "Ветеринарный контроль",
      icon: "Syringe",
      content: "Наличие ветеринарного паспорта с ежегодной вакцинацией. Вакцинация должна быть проведена не менее чем за 14 дней и не позднее 1 года до заселения."
    },
    {
      title: "Обработка и здоровье",
      icon: "CheckCircle2",
      content: "Обработка от глистов и паразитов не более чем за 3 месяца до заселения. Администратор проверяет отметки при заезде."
    },
    {
      title: "Безопасность",
      icon: "Verified",
      content: "К заселению принимаются только кастрированные животные. Для выгулов обязателен намордник. Собаки — на мягком ошейнике (безопасность 24/7)."
    }
  ],
  stopList: [
    "Без документов", 
    "Агрессивных / Постоянно лающих", 
    "Беременных / В период течки", 
    "Щенков и котят младше 4-х месяцев", 
    "Не кастрированных (по возрасту)", 
    "С медицинским уходом или инфекциями"
  ],
  checklist: [
    "Ветеринарный паспорт (на всё время)", 
    "Паспорт хозяина (для договора)", 
    "Любимые игрушки, лежанка или плед", 
    "Корм на весь период проживания", 
    "Витамины (при необходимости)", 
    "Одежда и ботиночки (если нужно)",
    "Шлейка / поводок / намордник",
    "Кошки — только в переноске"
  ]
};


const galleryImages = [
  { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop", title: "Уютный котик", span: "col-span-2", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop", title: "Активные игры", span: "col-span-1", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop", title: "Тихий час", span: "col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop", title: "Стильный гость", span: "col-span-2", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop", title: "Комфортный сон", span: "col-span-2", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1592754862816-1a6e7e7ad29d?q=80&w=800&auto=format&fit=crop", title: "Прогулка", span: "col-span-1", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop", title: "Любопытство", span: "col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1554692990-280459345688?q=80&w=800&auto=format&fit=crop", title: "Верный друг", span: "col-span-2", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=800&auto=format&fit=crop", title: "Минимализм", span: "col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop", title: "Отдых", span: "col-span-2", rotate: 1 },
  { url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800&auto=format&fit=crop", title: "Забота", span: "col-span-1", rotate: -1 },
  { url: "https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=800&auto=format&fit=crop", title: "Друзья", span: "col-span-3", rotate: 1 },
];

const FAQItem = ({ item, isOpen, onClick }: { item: any, isOpen: boolean, onClick: () => void, key?: any }) => {
  return (
    <div 
      className={`bg-stone-50 rounded-[2rem] md:rounded-[3rem] border ${
        isOpen ? 'border-stone-200' : 'border-stone-100'
      } overflow-hidden`}
    >
      <button
        onClick={onClick}
        className="w-full p-8 md:p-10 text-left"
      >
        <span className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-200 ${isOpen ? 'text-[#ff7e27]' : 'text-[#141414]'}`}>
          {item.q}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="px-8 md:px-10 pb-8 md:pb-10 pt-2 text-stone-500 font-bold text-lg leading-relaxed">
              <div className="pt-6 border-t border-stone-100/50">
                {item.a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQList = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      {faqData.map((item, idx) => (
        <FAQItem 
          key={idx} 
          item={item} 
          isOpen={activeFaq === idx} 
          onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} 
        />
      ))}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'booking'>('main');
  const [selectedCategory, setSelectedCategory] = useState<'cats' | 'dogs' | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
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

  const scrollToId = (id: string) => {
    if (currentPage !== 'main') {
      setCurrentPage('main');
      // Wait for the main page to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] font-sans selection:bg-[#99ed36] selection:text-[#141414]">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => { setCurrentPage('main'); window.scrollTo(0, 0); }}>
            <img
              src={logoImg}
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-500"
              alt="Логотип Бест френд — лучший зоотель в Москве"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter leading-none">Бест френд</span>
              <span className="text-[12px] md:text-[13px] font-bold text-stone-400">Зоотель в Москве</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 font-bold text-stone-600 text-[13px] xl:text-[14px]">
            <button onClick={() => scrollToId('rooms')} className="hover:text-[#99ed36] transition-all">Номера</button>
            <button onClick={() => scrollToId('about')} className="hover:text-[#ff7e27] transition-all">О нас</button>
            <button onClick={() => scrollToId('rules')} className="hover:text-[#ff7e27] transition-all whitespace-nowrap">Правила</button>
            <button onClick={() => scrollToId('promos')} className="hover:text-[#ff7e27] transition-all whitespace-nowrap">Акции</button>
            <button onClick={() => scrollToId('gallery')} className="hover:text-[#ff7e27] transition-all whitespace-nowrap">Фото</button>
            <button onClick={() => scrollToId('faq')} className="hover:text-[#ff7e27] transition-all">Вопросы</button>
            <button onClick={() => scrollToId('reviews')} className="hover:text-[#ff7e27] transition-all">Отзывы</button>
            <button onClick={() => scrollToId('contacts')} className="hover:text-[#99ed36] transition-all">Контакты</button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }} className="w-6 h-0.5 bg-black" />
              <motion.div animate={{ opacity: isMenuOpen ? 0 : 1 }} className="w-6 h-0.5 bg-black" />
              <motion.div animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }} className="w-6 h-0.5 bg-black" />
            </button>
            <button 
              onClick={() => scrollToId('contacts')}
              className="hidden sm:flex items-center gap-2 bg-[#141414] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg"
            >
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
                  { name: 'Номера', id: 'rooms' },
                  { name: 'О нас', id: 'about' },
                  { name: 'Правила', id: 'rules' },
                  { name: 'Акции', id: 'promos' },
                  { name: 'Фото', id: 'gallery' },
                  { name: 'Вопросы', id: 'faq' },
                  { name: 'Отзывы', id: 'reviews' },
                  { name: 'Контакты', id: 'contacts' }
                ].map((item, i) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => scrollToId(item.id)}
                    className="text-left text-3xl md:text-4xl font-black hover:text-[#ff7e27] transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-stone-100 mt-4 flex flex-col gap-4"
                >
                  <a href="tel:79670578130" className="text-2xl font-black text-[#ff7e27] flex items-center gap-3">
                    <Phone size={24} /> 7 (967) 057-81-30
                  </a>
                  <p className="text-stone-400 font-bold text-sm">с 10:00 до 21:00 ежедневно — Мы на связи</p>

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
            className="pt-20 md:pt-24 pb-12 md:pb-20 max-w-7xl mx-auto px-4 i md:px-6"
          >
            <button onClick={() => setCurrentPage('main')} className="flex items-center gap-2 mb-8 md:mb-10 font-bold text-stone-500 hover:text-[#ff7e27] transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Назад к выбору
            </button>

            <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-4 space-y-6">
                  <div className={`p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] ${selectedCategory === 'cats' ? 'bg-[#99ed36]' : 'bg-[#ff7e27]'} text-[#141414] shadow-2xl relative overflow-hidden`}>
                    <div className="relative z-10 flex flex-col">
                      <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">{selectedRoom.title}</h1>
                        <p className="text-2xl font-black opacity-60 tracking-tight">{selectedRoom.price}</p>
                      </div>
                      


                      <div className="space-y-6 mb-8 flex-1">
                        <div>
                          <p className="text-xs font-black text-[#141414] mb-4 tracking-wider uppercase">В стоимость входит:</p>
                          <div className="columns-1 sm:columns-2 gap-x-6 space-y-2 mb-6">
                            {selectedRoom.inclusions.map((item: string, i: number) => (
                              <div key={i} className="flex items-start gap-3 break-inside-avoid">
                                <div className="w-1.5 h-1.5 rounded-full bg-black/20 mt-1.5 shrink-0" />
                                <span className="font-bold text-sm leading-tight text-[#141414]">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-black/10 mb-6">
                          <p className="text-xs font-black text-[#141414] mb-3 tracking-wider uppercase">Дополнительные услуги:</p>
                          <p className="text-[13px] md:text-sm font-bold text-black/60 leading-relaxed">
                            Зоотакси и заселение вне рабочего времени — по индивидуальному согласованию с администратором за дополнительную плату
                          </p>
                        </div>

                        <div className="pt-6 border-t border-black/10 space-y-3">
                          <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl flex items-start gap-3 border border-white/20">
                            <Info size={18} className="shrink-0 mt-0.5 opacity-60" />
                            <p className="text-[13px] md:text-sm font-bold leading-relaxed text-[#141414]/80">
                              Минимальный срок — 1 сутки. При наличии мест возможно дневное пребывание (до 5 часов) за 50% стоимости.
                            </p>
                          </div>
                          <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl flex items-start gap-3 border border-white/20">
                            <AlertTriangle size={18} className="shrink-0 mt-0.5 opacity-60" />
                            <p className="text-[13px] md:text-sm font-bold leading-relaxed text-[#141414]/80">
                              Предоплата — 1000 ₽. При отмене бронирования менее чем за 2 суток предоплата не возвращается.
                            </p>
                          </div>
                        </div>
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
            className="pt-16 md:pt-20"
          >
            {/* HERO */}
            <section className="relative pt-3 md:pt-5 overflow-hidden bg-brand-orange">
              {/* Subtle Decorative Pattern or Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

              <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center flex flex-col items-center mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-7xl w-full"
                >
                  <div className="flex flex-col items-center mb-4 md:mb-6">
                    <h1 className="text-center px-2">
                      <span className="text-4xl sm:text-5xl md:text-[120px] font-black leading-[1.1] md:leading-[0.85] block text-brand-dark tracking-[-0.04em] md:tracking-[-0.05em]">
                        Бест френд — <br className="md:block hidden" />
                        зоотель в Москве <br className="md:block hidden" />
                        для кошек и собак
                      </span>
                    </h1>
                  </div>

                  <p className="text-[15px] md:text-xl text-brand-dark font-bold mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto text-center px-6 text-balance tracking-tight opacity-80">
                    Бережный уход, видеонаблюдение 24/7 и ежедневные фотоотчёты.
                    Создаем идеальные условия, чтобы ваш любимец чувствовал себя как&nbsp;дома.
                  </p>
                  <div className="flex justify-center mb-12 md:mb-12">
                    <a href="#rooms" className="group relative bg-brand-dark text-white px-10 md:px-14 py-5 md:py-7 rounded-full font-black text-lg md:text-xl hover:scale-105 transition-all shadow-2xl">
                      <span className="relative z-10 flex items-center gap-3">
                        Выбрать номер
                        <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* THE WHITE PLATE (BADGE) - FIXED SIZE & POSITION (OUTSIDE SCALE CONTAINER) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6, type: "spring" }}
                className="absolute right-[4%] md:right-[12%] bottom-[8%] md:bottom-[20%] z-40 bg-white p-3 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.12)] animate-float max-w-[130px] md:max-w-[260px]"
              >
                <div className="flex items-center gap-3 mb-1.5 md:mb-4">
                   <div className="flex -space-x-1.5 md:-space-x-2">
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-[#141414] flex items-center justify-center overflow-hidden"><Dog size={12} className="text-[#99ed36] md:scale-125" /></div>
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-[#141414] flex items-center justify-center overflow-hidden"><Heart size={12} className="text-white md:scale-125" /></div>
                   </div>
                </div>
                <p className="text-[10px] md:text-xl font-black text-brand-dark leading-[1.1] tracking-tight">
                  Берем собак <br /> всех пород <br /> и размеров
                </p>
                <p className="mt-1 md:mt-2 text-[8px] md:text-sm font-bold text-stone-400">
                  до 20 кг
                </p>
              </motion.div>

              {/* Narrower Image with Scroll Scale Effect */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ scale }}
                className="relative z-20 max-w-4xl mx-auto px-4 md:px-6 will-change-transform group"
              >
                {/* Image Background Support */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-white/5 blur-[130px] rounded-full -z-10" />

                <img
                  src={heroMainImg}
                  alt="Интерьер зоотеля Бест френд — комфортные номера для собак и кошек в Москве"
                  className="w-full h-auto block scale-[1.3] md:scale-100 origin-bottom"
                />
              </motion.div>
            </section>

            {/* ROOMS */}
            <section id="rooms" className="py-12 md:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-12">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Наши номера</h2>
                    <p className="text-lg md:text-xl text-stone-500 font-medium">Подберите идеальный вариант для вашего питомца</p>
                  </div>

                  <div className="bg-stone-100 p-2 rounded-full flex items-center gap-1 mx-auto md:mx-0">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                        


                        <div className="space-y-6 mb-10 flex-1">
                          <div className="bg-stone-50/50 p-6 rounded-[2rem] border border-stone-100">
                             <p className="text-xs font-black text-[#141414] mb-4 tracking-wider uppercase">В стоимость входит:</p>
                             <div className="columns-2 gap-x-4 space-y-1.5">
                               {room.inclusions.map((item: string, i: number) => (
                                 <div key={i} className="flex items-start gap-2.5 break-inside-avoid">
                                    <div className="w-1 h-1 rounded-full bg-stone-300 mt-1.5 shrink-0" />
                                    <span className="text-sm font-bold text-[#141414] leading-snug">{item}</span>
                                 </div>
                               ))}
                             </div>
                          </div>

                          {room.note && (
                            <div className="px-4 mt-2">
                              <p className="text-xs font-black text-stone-400 mb-2 tracking-wider uppercase">Примечание:</p>
                              <p className="text-base font-bold text-stone-600 leading-relaxed">{room.note}</p>
                            </div>
                          )}
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
            <section id="about" className="py-12 md:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="max-w-3xl mb-12">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">Курорт, который <br /><span className="text-[#ff7e27]">они заслужили</span></h2>
                  <p className="text-xl text-stone-500 font-medium leading-relaxed"><strong>Бест френд</strong> — это не просто современный <strong>зоотель в Москве</strong>, а уютная <strong>гостиница для кошек и собак</strong> с круглосуточным присмотром. Мы создали безопасное и технологичное пространство для <strong>передержки животных</strong>, где каждый гость окружен искренней любовью и заботой.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: Camera, title: "Видео 24/7", text: "Круглосуточный видеоконтроль с доступом через приложение.", color: "bg-[#99ed36]" },
                    { icon: LucideImage, title: "Фотоотчёт", text: "Ежедневные фото и видео вашего любимца в мессенджеры.", color: "bg-[#ff7e27]" },
                    { icon: Thermometer, title: "Климат", text: "Теплые полы, очистка воздуха и комфортная температура.", color: "bg-[#99ed36]" },
                    { icon: Heart, title: "Любовь", text: "Профессиональный уход и безграничное внимание 24/7.", color: "bg-[#ff7e27]" },
                    { icon: ShieldCheck, title: "Изоляция", text: "Зоны кошек и собак полностью разделены, что исключает стресс постояльцев.", color: "bg-[#99ed36]" },
                    { icon: Sparkles, title: "Гигиена", text: "Уборка дважды в день и полная дезинфекция каждого номера после выезда.", color: "bg-[#ff7e27]" },
                  ].map((item, i) => (
                    <div key={i} className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-50 transition-all">
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
            {/* RULES SECTION (PRO MAX EDITION) */}
            <section id="rules" className="py-12 md:py-20 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mb-12">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                    Правила <br /><span className="text-[#ff7e27]">размещения</span>
                  </h2>
                  <p className="text-xl text-stone-500 font-bold leading-relaxed">
                    Мы создали максимально безопасную среду. Ознакомьтесь с требованиями, основанными на многолетнем опыте заботы о животных.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                  {rulesSections.main.map((rule, i) => {
                    const Icon = rule.icon === 'Dog' ? Dog : 
                                 rule.icon === 'Syringe' ? Syringe : 
                                 rule.icon === 'CheckCircle2' ? CheckCircle2 : 
                                 Verified;
                    return (
                      <div key={i} className="break-inside-avoid">
                        <div className="p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-100/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left h-full">
                          <Icon className="text-[#ff7e27] mb-8 md:mb-10 w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
                          <h4 className="text-xl md:text-2xl font-black mb-4 md:mb-6 tracking-tight leading-none md:leading-tight text-[#141414]">
                            {rule.title}
                          </h4>
                          <p className="text-stone-500 font-bold text-sm md:text-base leading-relaxed text-balance">
                            {rule.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
                  {/* Static Large Dog Image - NOW ON TOP ON MOBILE, RIGHT ON DESKTOP */}
                  <div className="lg:col-span-6 relative order-1 lg:order-2 pt-0 lg:pt-16">
                    <div className="relative flex justify-center lg:justify-end">
                      <img 
                        src={dogRulesImg} 
                        className="w-full max-w-[500px] lg:max-w-none h-auto object-contain transform scale-110 md:scale-125 lg:scale-150 origin-center lg:origin-top-right"
                        alt="Собака"
                      />
                      {/* Abstract decorative shape behind dog */}
                      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#99ed36]/5 rounded-full blur-[100px] lg:blur-[150px]"></div>
                    </div>
                  </div>

                  {/* Lists Content Area (NOW BELOW ON MOBILE, LEFT ON DESKTOP) */}
                  <div className="lg:col-span-6 order-2 lg:order-1 space-y-12 md:space-y-16">
                    
                    {/* CHECKLIST Section */}
                    <div>
                      <div className="flex flex-col items-center text-center mb-8">
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-[#141414]">Что взять с собой</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {rulesSections.checklist.map((item, i) => (
                          <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#99ed36]/10 border border-[#99ed36]/20 shadow-sm hover:shadow-md transition-all group cursor-default h-full">
                            <span className="font-bold text-stone-700 text-[13px] md:text-sm leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 text-[12px] font-bold text-[#141414]/60 text-center">
                        * Оригиналы документов находятся у нас весь срок пребывания
                      </div>
                    </div>

                    {/* STOP LIST Section */}
                    <div>
                      <div className="flex flex-col items-center text-center mb-8">
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-[#141414]">Мы не принимаем</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {rulesSections.stopList.map((item, i) => (
                          <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-red-50/50 border border-red-100/60 shadow-sm hover:shadow-md transition-all group cursor-default h-full">
                            <span className="font-bold text-stone-700 text-[13px] md:text-sm leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
{/* PROMOTIONS */}
            <section id="promos" className="py-12 md:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-12">
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

            <section id="gallery" className="py-12 md:py-20 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Жизнь в отеле</h2>
                  <p className="text-stone-400 font-bold">Спокойствие и радость в каждом кадре</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10 grid-flow-row-dense">
                  {galleryImages.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, rotate: 0 }}
                      whileInView={{ opacity: 1, rotate: img.rotate || 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl relative ${
                        img.span === 'col-span-3' ? 'col-span-2 md:col-span-3' : 
                        img.span === 'col-span-2' ? 'col-span-1 md:col-span-2' : 
                        'col-span-1'
                      }`}
                    >
                      <motion.img 
                        src={img.url} 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-64 md:h-[450px] object-cover scale-[1.1]" 
                        alt={img.title} 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-12 md:py-20 bg-white relative overflow-hidden">
              <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Остались вопросы?</h2>
                  <p className="text-stone-400 font-bold text-lg">Мы собрали ответы на самые частые обращения</p>
                </div>
                
                <FAQList />
              </div>
            </section>
            <section id="reviews" className="py-12 md:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Отзывы гостей</h2>
                  <p className="text-stone-400 font-bold">Реальные истории проживания в нашем отеле</p>
                </div>
                
                 <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory gap-4 pb-12 px-5 md:px-0">
                  {testimonialData.slice(0, visibleReviews).map((t, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="min-w-[280px] w-[82vw] md:w-auto md:min-w-0 snap-start flex-shrink-0 break-inside-avoid bg-stone-50 p-7 md:p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < t.stars ? "#ff7e27" : "none"} 
                              className={i < t.stars ? "text-[#ff7e27]" : "text-stone-200"} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{t.stayDate}</span>
                      </div>
                      
                      <p className="text-lg font-medium leading-relaxed mb-8 text-stone-700">
                        "{t.text}"
                      </p>
                      
                      <div className="flex items-center gap-4 pt-6 border-t border-stone-50">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                          t.type === 'cat' 
                            ? 'bg-[#99ed36]/10 text-[#99ed36] group-hover:bg-[#99ed36] group-hover:text-white' 
                            : 'bg-[#ff7e27]/10 text-[#ff7e27] group-hover:bg-[#ff7e27] group-hover:text-white'
                        }`}>
                          {t.type === 'cat' ? <Cat size={24} /> : <Dog size={24} />}
                        </div>
                        <div>
                          <p className="font-black text-lg leading-none mb-1">{t.name}</p>
                          <p className={`text-xs font-black uppercase tracking-tight ${
                            t.type === 'cat' ? 'text-[#99ed36]' : 'text-[#ff7e27]'
                          }`}>{t.pet}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {visibleReviews < testimonialData.length && (
                  <div className="mt-16 text-center">
                    <button 
                      onClick={() => setVisibleReviews(prev => prev + 3)}
                      className="px-10 py-5 rounded-full bg-[#141414] text-white font-black hover:bg-[#ff7e27] active:bg-[#ff7e27] transition-all active:scale-95 shadow-xl"
                    >
                      Показать больше отзывов
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* CONTACTS */}
            <section id="contacts" className="py-12 md:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10">Контакты</h2>
                <div className="bg-white rounded-[3.5rem] overflow-hidden grid lg:grid-cols-2 shadow-2xl border border-stone-100">
                  <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                    <div className="mb-6 md:mb-8">
                      <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter text-[#141414]">
                        Заходите <span className="text-[#ff7e27]">в гости</span>
                      </h3>
                      <p className="text-stone-400 font-bold text-lg">Мы всегда рады вам и вашим питомцам</p>
                    </div>

                    <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
                      
                      <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100 transition-all group-hover:bg-[#ff7e27]/10 group-hover:border-[#ff7e27]/30">
                          <MapPin size={22} className="text-[#ff7e27]" />
                        </div>
                        <p className="text-lg md:text-xl font-bold tracking-tight text-[#141414]">
                          Бизнес-парк «Волжский» <br /> 
                          г. Москва, Волжский бульвар, д.51 с.7, пом. 123-124
                        </p>
                      </div>

                      <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100 transition-all group-hover:bg-[#99ed36]/10 group-hover:border-[#99ed36]/30">
                          <Phone size={22} className="text-[#99ed36]" />
                        </div>
                        <a href="tel:79670578130" className="text-lg md:text-xl font-black hover:text-[#ff7e27] transition-all tracking-tight text-[#141414]">
                          7 (967) 057-81-30
                        </a>
                      </div>

                      <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100 transition-all group-hover:bg-[#ff7e27]/10 group-hover:border-[#ff7e27]/30">
                          <Clock size={22} className="text-[#ff7e27]" />
                        </div>
                        <p className="text-lg md:text-xl font-bold tracking-tight text-[#141414]">
                          с 10:00 до 21:00 ежедневно
                        </p>
                      </div>

                      <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100 transition-all group-hover:bg-[#99ed36]/10 group-hover:border-[#99ed36]/30">
                          <Car size={22} className="text-[#99ed36]" />
                        </div>
                        <p className="text-lg md:text-xl font-bold tracking-tight text-[#141414] leading-relaxed">
                          Удобная парковка у здания. Въезд под шлагбаум на территорию бизнес-парка
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 md:pt-10 space-y-8">
                      <div>
                        <p className="text-stone-400 font-bold mb-6 text-sm">Написать нам:</p>
                      <div className="flex flex-wrap gap-3">
                        <a 
                          href="https://t.me/best_friend_hotel" 
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 bg-stone-50 py-4 px-6 rounded-2xl hover:bg-[#24A1DE] hover:text-white transition-all duration-300 border border-stone-100 group"
                        >
                          <img src={telegramLogoImg} className="w-5 h-5 object-contain" alt="Telegram" />
                          <span className="text-sm font-bold">Telegram</span>
                        </a>

                        <a 
                          href="https://t.me/MAX_CONTACT" 
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 bg-stone-50 py-4 px-6 rounded-2xl hover:bg-[#99ed36] hover:text-[#141414] transition-all duration-300 border border-stone-100 group"
                        >
                          <img src={logoMaxImg} className="w-8 h-8 object-contain" alt="Max" />
                          <span className="text-sm font-bold tracking-tight">MAX</span>
                        </a>

                        <a 
                          href="mailto:hello@best-friend.ru" 
                          className="flex items-center gap-3 bg-stone-50 py-4 px-6 rounded-2xl hover:bg-[#ff7e27] hover:text-white transition-all duration-300 border border-stone-100 group"
                        >
                          <Mail size={18} />
                          <span className="text-sm font-bold">Email</span>
                        </a>
                      </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[400px] lg:h-auto min-h-[500px] relative">
                    <iframe 
                      src="https://yandex.ru/map-widget/v1/?ll=37.759210%2C55.694540&z=16&pt=37.759210,55.694540,pm2rdm" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0"
                      title="Yandex Map"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="py-20 md:py-24 bg-[#141414] text-stone-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-20">
            {/* LOGO */}
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setCurrentPage('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <img src={logoImg} className="w-12 h-12 object-contain opacity-90" alt="Бест френд" />
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter leading-none text-white">Бест френд</span>
                  <span className="text-xs font-bold text-stone-500">Зоотель в Москве</span>
                </div>
              </div>
            </div>

            {/* NAVIGATION DUPLICATE */}
            <div className="md:col-span-1">
              <h4 className="text-white font-black text-lg mb-8">Навигация</h4>
              <nav className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-4 font-bold text-stone-500">
                <button onClick={() => scrollToId('rooms')} className="hover:text-[#99ed36] transition-all text-left">Номера</button>
                <button onClick={() => scrollToId('about')} className="hover:text-[#ff7e27] transition-all text-left">О нас</button>
                <button onClick={() => scrollToId('rules')} className="hover:text-[#ff7e27] transition-all text-left">Правила</button>
                <button onClick={() => scrollToId('promos')} className="hover:text-[#ff7e27] transition-all text-left">Акции</button>
                <button onClick={() => scrollToId('gallery')} className="hover:text-[#ff7e27] transition-all text-left">Фото</button>
                <button onClick={() => scrollToId('faq')} className="md:hidden hover:text-[#ff7e27] transition-all text-left">Вопросы</button>
                <button onClick={() => scrollToId('reviews')} className="md:hidden hover:text-[#ff7e27] transition-all text-left">Отзывы</button>
                <button onClick={() => scrollToId('contacts')} className="md:hidden hover:text-[#99ed36] transition-all text-left">Контакты</button>
              </nav>
            </div>

            <div className="hidden md:block">
              <h4 className="text-white font-black text-lg mb-8">Разделы</h4>
              <nav className="flex flex-col gap-4 font-bold text-stone-500">
                <button onClick={() => scrollToId('faq')} className="hover:text-[#ff7e27] transition-all text-left">Вопросы</button>
                <button onClick={() => scrollToId('reviews')} className="hover:text-[#ff7e27] transition-all text-left">Отзывы</button>
                <button onClick={() => scrollToId('contacts')} className="hover:text-[#99ed36] transition-all text-left">Контакты</button>
              </nav>
            </div>

            {/* CONTACTS */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-black text-lg mb-8">Контакты</h4>
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider">Адрес</span>
                  <p className="text-stone-300 font-bold leading-relaxed text-sm">
                    г. Москва, Волжский бульвар, <br />д.51 с.7, пом. 123-124
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider">Телефон</span>
                  <a href="tel:79670578130" className="text-white text-lg font-black hover:text-[#ff7e27] transition-all">
                    7 (967) 057-81-30
                  </a>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider">Режим работы</span>
                  <p className="text-white text-lg font-black tracking-tight">
                    с 10:00 до 21:00 ежедневно
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="flex flex-wrap gap-4">
              <a href="https://t.me/best_friend_hotel" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#24A1DE] transition-all border border-white/5">
                <img src={telegramLogoImg} className="w-6 h-6 object-contain" alt="Telegram" />
              </a>
              <a href="https://t.me/MAX_CONTACT" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#99ed36] transition-all border border-white/5 group">
                <img src={logoMaxImg} className="w-6 h-6 object-contain" alt="Max" />
              </a>
              <a href="mailto:hello@best-friend.ru" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#ff7e27] transition-all border border-white/5">
                <Mail size={20} />
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 text-xs font-bold text-stone-600 uppercase">
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 uppercase">
                <span>ОГРНИП325774600614104</span>
                <span>ИНН482413133456</span>
              </div>
              <p className="text-stone-700 font-medium whitespace-nowrap">© 2026 Бест френд — зоотель. Все права защищены.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

