import React, { useState, useEffect } from 'react';
import { 
  Save, Image, Layout, MessageSquare, Phone, Plus, Trash2, 
  ChevronRight, LogOut, Loader2, Star, CheckCircle2, X, Upload,
  Settings, User, MapPin, Mail, Instagram, Send, Info, AlertCircle, Check, Play, Shield, List
} from 'lucide-react';
import initialContent from './data/content.json';

const GITHUB_REPO = "Nikitaa2333333/zoo";
const CONTENT_PATH = "src/data/content.json";

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
  const [isLogged, setIsLogged] = useState(!!token);
  const [isSandbox, setIsSandbox] = useState(false);
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('sandbox_content');
    return saved ? JSON.parse(saved) : initialContent;
  });
  const [activeTab, setActiveTab] = useState('rooms');
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length > 10) {
      localStorage.setItem('gh_token', token);
      setIsLogged(true);
      setIsSandbox(false);
    }
  };

  const startSandbox = () => {
    setIsSandbox(true);
    setIsLogged(true);
    setStatus({ type: 'info', msg: 'Вы вошли в режим Песочницы. Все изменения локальные (в браузере).' });
  };

  const saveToGitHub = async () => {
    setLoading(true);
    setStatus({ type: 'info', msg: isSandbox ? 'Сохранение локально...' : 'Связь с GitHub...' });

    if (isSandbox) {
      localStorage.setItem('sandbox_content', JSON.stringify(content));
      setTimeout(() => {
        setLoading(false);
        setStatus({ type: 'success', msg: 'Локальная копия обновлена!' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
      }, 500);
      return;
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`, {
        headers: { Authorization: `token ${token}` }
      });
      
      const fileData = await res.json();
      if (!res.ok) throw new Error(`Ошибка получения SHA (код ${res.status}): ${fileData.message}`);
      
      const updateRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Admin update: ${new Date().toLocaleString()}`,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
          sha: fileData.sha
        })
      });

      if (updateRes.ok) {
        localStorage.setItem('sandbox_content', JSON.stringify(content));
        setStatus({ type: 'success', msg: 'Данные успешно сохранены! Сайт обновится через 1-2 минуты.' });
      } else {
        const errorData = await updateRes.json();
        throw new Error(`Гитхаб отклонил запрос (${updateRes.status}): ${errorData.message}`);
      }
    } catch (err: any) {
      console.error("GitHub Save Error:", err);
      setStatus({ type: 'error', msg: err.message });
    }
    setLoading(false);
    setTimeout(() => setStatus({ type: '', msg: '' }), 6000);
  };

  const compressAndUploadImage = async (file: File) => {
    if (isSandbox) {
       return new Promise((resolve) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = (e) => resolve(e.target?.result as string);
       });
    }

    setImgLoading(true);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > 1200) { height *= 1200 / width; width = 1200; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const webpData = canvas.toDataURL('image/webp', 0.8);
          const base64 = webpData.split(',')[1];
          const fileName = `img_${Date.now()}.webp`;
          const filePath = `public/images/uploads/${fileName}`;
          
          try {
            const uploadRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
              method: 'PUT',
              headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: `Upload: ${fileName}`, content: base64 })
            });

            if (uploadRes.ok) {
              setImgLoading(false);
              resolve(`/images/uploads/${fileName}`);
            } else {
              setImgLoading(false);
              const err = await uploadRes.json();
              reject(err.message);
            }
          } catch (e: any) {
            setImgLoading(false);
            reject(e.message);
          }
        };
      };
    });
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#99ed36]/20 rounded-full blur-3xl"></div>
          <div className="w-20 h-20 bg-[#141414] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/5">
             <Settings size={40} className="text-[#99ed36]" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Admin Panel</h2>
          <p className="text-stone-400 font-bold mb-8 text-sm">Управление контентом Best Friend</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input 
              type="password" placeholder="GitHub Token"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#99ed36] transition-all font-mono text-sm"
              value={token} onChange={(e) => setToken(e.target.value)}
            />
            <button className="w-full bg-[#141414] border border-white/10 text-white font-black py-5 rounded-2xl hover:bg-[#ff7e27] transition-all transform hover:scale-[1.02] shadow-xl text-lg">
              ПОДКЛЮЧИТЬ (LIVE)
            </button>
          </form>
          <button onClick={startSandbox} className="w-full mt-4 bg-[#99ed36] text-[#141414] font-black py-5 rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2">
            <Play size={20} /> ВОЙТИ ЛОКАЛЬНО
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex font-sans text-[#141414]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-stone-100 p-8 flex flex-col gap-10 sticky top-0 h-screen">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center shadow-2xl">
             <Layout size={20} className="text-[#99ed36]" />
          </div>
          <span className="font-black text-xl tracking-tighter">Admin</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'rooms', icon: Layout, label: 'Номера' },
            { id: 'about', icon: Info, label: 'О нас' },
            { id: 'rules', icon: Shield, label: 'Правила' },
            { id: 'promo', icon: MessageSquare, label: 'Акции' },
            { id: 'faq', icon: HelpCircle, label: 'FAQ' },
            { id: 'reviews', icon: Star, label: 'Отзывы' },
            { id: 'gallery', icon: Image, label: 'Галерея' },
            { id: 'contacts', icon: Phone, label: 'Контакты' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 py-4 px-5 rounded-2xl font-black text-sm transition-all ${activeTab === item.id ? 'bg-[#141414] text-white shadow-xl' : 'text-stone-400 hover:bg-stone-50'}`}>
              {/* @ts-ignore */}
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsLogged(false)} className="mt-auto flex items-center gap-2 text-stone-300 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-all">
          <LogOut size={14} /> Выйти
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter italic">Dashboard</h1>
          <button onClick={saveToGitHub} disabled={loading} className={`py-5 px-10 rounded-full font-black flex items-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${isSandbox ? 'bg-blue-500 text-white' : 'bg-[#141414] text-white'}`}>
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isSandbox ? 'СОХРАНИТЬ ЛОКАЛЬНО' : 'ОПУБЛИКОВАТЬ'}
          </button>
        </header>

        {status.msg && (
          <div className={`mb-10 p-6 rounded-3xl font-black text-sm flex items-center gap-4 shadow-xl border animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-[#99ed36] text-[#141414]' : status.type === 'error' ? 'bg-red-500 text-white' : 'bg-black text-white'}`}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : status.type === 'error' ? <AlertCircle size={20} /> : <Loader2 className="animate-spin" size={20} />}
            {status.msg}
          </div>
        )}

        <div className="space-y-10">
          
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {[...content.catRooms, ...content.dogRooms].map((room, idx) => (
                <div key={room.title + idx} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm space-y-6">
                  <div className="flex gap-8">
                    <div className="w-32 h-32 rounded-2xl bg-stone-50 overflow-hidden relative group shrink-0">
                       <img src={room.image} className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer text-white">
                          <Upload size={20} />
                          <input type="file" className="hidden" onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                                try {
                                  const url = await compressAndUploadImage(file);
                                  const isCat = content.catRooms.some((r:any) => r.title === room.title);
                                  const list = isCat ? [...content.catRooms] : [...content.dogRooms];
                                  const rIdx = list.findIndex((r:any) => r.title === room.title);
                                  list[rIdx].image = url;
                                  setContent({...content, [isCat ? 'catRooms' : 'dogRooms']: list});
                                  setStatus({ type: 'success', msg: 'Фото обновлено' });
                                } catch (err:any) { setStatus({ type: 'error', msg: err }); }
                             }
                          }} />
                       </label>
                    </div>
                    <div className="flex-1 space-y-4">
                       <input className="text-2xl font-black w-full bg-stone-50 p-4 rounded-xl" value={room.title} onChange={(e) => {
                          const isCat = content.catRooms.some((r:any) => r.title === room.title);
                          const list = isCat ? [...content.catRooms] : [...content.dogRooms];
                          const rIdx = list.findIndex((r:any) => r.title === room.title);
                          list[rIdx].title = e.target.value;
                          setContent({...content, [isCat ? 'catRooms' : 'dogRooms']: list});
                       }} />
                       <div className="grid grid-cols-2 gap-4">
                          <input className="font-bold bg-stone-50 p-4 rounded-xl" value={room.price} onChange={(e) => {
                             const isCat = content.catRooms.some((r:any) => r.title === room.title);
                             const list = isCat ? [...content.catRooms] : [...content.dogRooms];
                             const rIdx = list.findIndex((r:any) => r.title === room.title);
                             list[rIdx].price = e.target.value;
                             setContent({...content, [isCat ? 'catRooms' : 'dogRooms']: list});
                          }} />
                          <input className="font-bold bg-stone-50 p-4 rounded-xl" value={room.area} onChange={(e) => {
                             const isCat = content.catRooms.some((r:any) => r.title === room.title);
                             const list = isCat ? [...content.catRooms] : [...content.dogRooms];
                             const rIdx = list.findIndex((r:any) => r.title === room.title);
                             list[rIdx].area = e.target.value;
                             setContent({...content, [isCat ? 'catRooms' : 'dogRooms']: list});
                          }} />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white p-10 rounded-[3rem] border border-stone-100 space-y-8">
               <div>
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 block mb-4">Заголовок О Нас</label>
                  <input className="w-full bg-stone-50 p-6 rounded-2xl font-black text-2xl" value={content.about.title} onChange={(e) => setContent({...content, about: {...content.about, title: e.target.value}})} />
               </div>
               <div>
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 block mb-4">Описание</label>
                  <textarea className="w-full bg-stone-50 p-6 rounded-2xl font-bold h-40 resize-none" value={content.about.subtitle} onChange={(e) => setContent({...content, about: {...content.about, subtitle: e.target.value}})} />
               </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[3rem] border border-stone-100">
                  <h3 className="text-2xl font-black mb-8 underline decoration-[#99ed36] decoration-4">Кого принимаем / Здоровье</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {content.rules.main.map((rule: any, i: number) => (
                        <div key={i} className="p-6 bg-stone-50 rounded-2xl space-y-4">
                           <input className="font-black w-full bg-white px-4 py-2 rounded-lg" value={rule.title} onChange={(e) => {
                              const newRules = {...content.rules};
                              newRules.main[i].title = e.target.value;
                              setContent({...content, rules: newRules});
                           }} />
                           <textarea className="w-full font-bold text-sm h-24 p-4 rounded-lg resize-none" value={rule.content} onChange={(e) => {
                              const newRules = {...content.rules};
                              newRules.main[i].content = e.target.value;
                              setContent({...content, rules: newRules});
                           }} />
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[3rem] border border-stone-100">
                     <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><X className="text-red-500" /> Стоп-лист</h3>
                     <div className="space-y-2">
                        {content.rules.stopList.map((item: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <input className="flex-1 bg-stone-50 px-4 py-2 rounded-lg font-bold text-sm" value={item} onChange={(e) => {
                                 const newList = [...content.rules.stopList];
                                 newList[i] = e.target.value;
                                 setContent({...content, rules: {...content.rules, stopList: newList}});
                              }} />
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[3rem] border border-stone-100">
                     <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Check className="text-[#99ed36]" /> Чек-лист вещей</h3>
                     <div className="space-y-2">
                        {content.rules.checklist.map((item: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <input className="flex-1 bg-stone-50 px-4 py-2 rounded-lg font-bold text-sm" value={item} onChange={(e) => {
                                 const newList = [...content.rules.checklist];
                                 newList[i] = e.target.value;
                                 setContent({...content, rules: {...content.rules, checklist: newList}});
                              }} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'promo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.promo.items.map((item: any, i: number) => (
                <div key={i} className={`p-10 rounded-[3rem] border shadow-sm space-y-6 ${item.textWhite ? 'bg-[#141414] text-white' : 'bg-white text-[#141414]'}`}>
                  <input className={`text-2xl font-black w-full bg-transparent border-b-2 mb-2 ${item.textWhite ? 'border-white/10' : 'border-stone-100'}`} value={item.title} onChange={(e) => {
                    const newItems = [...content.promo.items];
                    newItems[i].title = e.target.value;
                    setContent({...content, promo: {...content.promo, items: newItems}});
                  }} />
                  <textarea className={`w-full bg-transparent font-bold text-sm h-24 resize-none opacity-80`} value={item.text} onChange={(e) => {
                    const newItems = [...content.promo.items];
                    newItems[i].text = e.target.value;
                    setContent({...content, promo: {...content.promo, items: newItems}});
                  }} />
                  <div className="flex gap-4">
                    <input className="w-24 p-3 rounded-xl bg-white/10 font-black text-center" value={item.discount} onChange={(e) => {
                      const newItems = [...content.promo.items];
                      newItems[i].discount = e.target.value;
                      setContent({...content, promo: {...content.promo, items: newItems}});
                    }} />
                    <input className="flex-1 p-3 rounded-xl bg-white/10 font-bold italic text-sm" value={item.note} onChange={(e) => {
                      const newItems = [...content.promo.items];
                      newItems[i].note = e.target.value;
                      setContent({...content, promo: {...content.promo, items: newItems}});
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ... other tabs (faq, gallery, etc) can be expanded similarly if needed ... */}
          {activeTab === 'faq' && (
             <div className="space-y-4">
                {content.faq.map((item: any, i: number) => (
                   <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 flex gap-4">
                      <div className="flex-1 space-y-4">
                         <input className="w-full font-black text-lg bg-stone-50 p-4 rounded-xl" value={item.q} onChange={(e) => {
                            const newFaq = [...content.faq];
                            newFaq[i].q = e.target.value;
                            setContent({...content, faq: newFaq});
                         }} />
                         <textarea className="w-full font-bold text-sm bg-stone-50 p-4 rounded-xl h-24" value={item.a} onChange={(e) => {
                             const newFaq = [...content.faq];
                             newFaq[i].a = e.target.value;
                             setContent({...content, faq: newFaq});
                         }} />
                      </div>
                      <button onClick={() => setContent({...content, faq: content.faq.filter((_:any,idx:number) => idx !== i)})} className="p-4 text-stone-200 hover:text-red-500 hover:bg-stone-50 rounded-xl transition-all self-start">
                         <Trash2 size={20} />
                      </button>
                   </div>
                ))}
                <button onClick={() => setContent({...content, faq: [...content.faq, {q: "Вопрос", a: "Ответ"}]})} className="w-full py-6 bg-[#141414] text-white font-black rounded-full flex items-center justify-center gap-3 hover:bg-[#ff7e27] transition-all">
                   <Plus /> Добавить вопрос
                </button>
             </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {content.gallery.map((img: any, i: number) => (
                  <div key={i} className="aspect-[4/5] rounded-[2rem] overflow-hidden group relative border-4 border-white shadow-xl">
                     <img src={img.url} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button onClick={() => setContent({...content, gallery: content.gallery.filter((_:any,idx:number) => idx !== i)})} className="p-4 bg-red-500 text-white rounded-xl hover:scale-110 transition-all shadow-xl">
                           <Trash2 size={24} />
                        </button>
                     </div>
                  </div>
               ))}
               <label className="aspect-[4/5] bg-white border-4 border-dashed border-stone-100 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#99ed36] hover:bg-stone-50 transition-all group">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#99ed36] group-hover:scale-110 transition-all shadow-lg">
                     {imgLoading ? <Loader2 className="animate-spin" /> : <Plus />}
                  </div>
                  <span className="mt-3 text-[10px] font-black uppercase text-stone-400">Добавить фото</span>
                  <input type="file" className="hidden" disabled={imgLoading} onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                        try {
                           const url = await compressAndUploadImage(file);
                           setContent({...content, gallery: [...content.gallery, { url, title: "Gallery", span: "col-span-1", rotate: 0 }]});
                           setStatus({ type: 'success', msg: 'Фото добавлено' });
                        } catch (err:any) { setStatus({ type: 'error', msg: err }); }
                     }
                  }} />
               </label>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="bg-white p-10 rounded-[3rem] border border-stone-100 space-y-10">
               <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-black uppercase text-stone-300 block mb-3">Телефон</label>
                    <input className="w-full bg-stone-50 p-5 rounded-xl font-black text-xl" value={content.contacts.phone} onChange={(e) => setContent({...content, contacts: {...content.contacts, phone: e.target.value}})} />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-stone-300 block mb-3">Email</label>
                    <input className="w-full bg-stone-50 p-5 rounded-xl font-black text-xl" value={content.contacts.email} onChange={(e) => setContent({...content, contacts: {...content.contacts, email: e.target.value}})} />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-black uppercase text-stone-300 block mb-3">Адрес</label>
                  <textarea className="w-full bg-stone-50 p-5 rounded-xl font-bold h-32 resize-none" value={content.contacts.address} onChange={(e) => setContent({...content, contacts: {...content.contacts, address: e.target.value}})} />
               </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {content.reviews.map((rev: any, i: number) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative group flex flex-col">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-1 text-[#ff7e27]">
                           {[...Array(rev.stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <button onClick={() => setContent({...content, reviews: content.reviews.filter((_:any,idx:number) => idx !== i)})} className="text-stone-100 hover:text-red-500 transition-colors">
                           <Trash2 size={18} />
                        </button>
                     </div>
                     <textarea className="flex-1 bg-stone-50 rounded-2xl p-4 font-bold text-sm text-stone-600 outline-none h-40 resize-none mb-6" value={rev.text} onChange={(e) => {
                        const newRev = [...content.reviews];
                        newRev[i].text = e.target.value;
                        setContent({...content, reviews: newRev});
                     }} />
                     <div className="space-y-2">
                        <input className="font-black text-xl w-full" value={rev.name} onChange={(e) => {
                           const newRev = [...content.reviews];
                           newRev[i].name = e.target.value;
                           setContent({...content, reviews: newRev});
                        }} />
                        <input className="text-[10px] font-black uppercase text-[#99ed36] bg-[#99ed36]/5 px-3 py-1 rounded-full" value={rev.pet} onChange={(e) => {
                           const newRev = [...content.reviews];
                           newRev[i].pet = e.target.value;
                           setContent({...content, reviews: newRev});
                        }} />
                     </div>
                  </div>
               ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

const HelpCircle = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
