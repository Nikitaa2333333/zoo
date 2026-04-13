import React, { useState, useEffect } from 'react';
import {
  Save, Image, Layout, MessageSquare, Phone, Plus, Trash2,
  ChevronRight, LogOut, Loader2, Star, CheckCircle2, X, Upload,
  Settings, User, MapPin, Mail, Instagram, Send, Info, AlertCircle, Check, Play, Shield, List, HelpCircle,
  Camera, Thermometer, Heart, ShieldCheck, Sparkles, ExternalLink, Clock,
  Dog, Syringe, Verified,
} from 'lucide-react';
import initialContent from './data/content.json';

// Динамический маппинг иконок для контента (вместо import * as Icons)
const Icons: Record<string, React.ElementType> = {
  Camera, Thermometer, Heart, ShieldCheck, Sparkles, Dog, Syringe, CheckCircle2, Verified,
  Image, LucideImage: Image,
};

const GITHUB_REPO = "Nikitaa2333333/zoo";
const CONTENT_PATH = "src/data/content.json";

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
  const [isLogged, setIsLogged] = useState(!!token);
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('sandbox_content');
    return saved ? JSON.parse(saved) : initialContent;
  });
  const [activeTab, setActiveTab] = useState('rooms');
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const saveToGitHub = async () => {
    if (!token) {
        setStatus({ type: 'error', msg: 'Введите GitHub Token в настройках' });
        return;
    }
    setLoading(true);
    setStatus({ type: 'info', msg: 'Синхронизация с GitHub...' });

    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`, {
        headers: { Authorization: `token ${token}` }
      });
      
      const fileData = await res.json();
      if (!res.ok) throw new Error(`Ошибка связи (код ${res.status}): ${fileData.message}`);
      
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
        setStatus({ type: 'success', msg: 'Данные успешно обновлены! Сайт обновится через 1 минуту.' });
      } else {
        const errorData = await updateRes.json();
        throw new Error(`Гитхаб отклонил запрос: ${errorData.message}`);
      }
    } catch (err: any) {
      console.error("GitHub Save Error:", err);
      setStatus({ type: 'error', msg: err.message });
    }
    setLoading(false);
    setTimeout(() => setStatus({ type: '', msg: '' }), 6000);
  };

  const compressAndUploadImage = async (file: File) => {
    if (!token) throw new Error("Token missing");
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      localStorage.setItem('gh_token', token);
      setIsLogged(true);
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=2000&auto=format&fit=crop)' }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
        <form onSubmit={handleLogin} className="relative bg-white/10 backdrop-blur-2xl p-12 rounded-[3.5rem] w-full max-w-md border border-white/20 shadow-2xl space-y-8">
           <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#99ed36] rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(153,237,54,0.3)]">
                 <Shield className="text-[#141414]" size={40} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Best Friend Admin</h1>
              <p className="text-white/40 font-bold text-sm">Введите GitHub Токен для управления сайтом</p>
           </div>
           <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-white/5 border border-white/10 text-white p-6 rounded-2xl font-mono text-center outline-none focus:border-[#99ed36] transition-all" />
           <button type="submit" className="w-full bg-[#99ed36] text-[#141414] py-6 rounded-full font-black tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">ВОЙТИ</button>
           <button type="button" onClick={() => setIsLogged(true)} className="w-full text-white/40 font-black text-xs tracking-widest uppercase hover:text-white transition-all">Песочница (без сохранения)</button>
        </form>
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
          <span className="font-black text-xl tracking-tighter">Admin v2.0</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'rooms', icon: Layout, label: 'Номера' },
            { id: 'about', icon: Info, label: 'Преимущества' },
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
        <div className="mt-auto pt-6 border-t border-stone-50 space-y-4">
           <div className="flex items-center gap-2 text-[10px] font-black text-stone-300 uppercase tracking-widest">
              <CheckCircle2 size={12} className="text-[#99ed36]" /> {token ? 'CONNECTED' : 'OFFLINE'}
           </div>
           <button onClick={() => { localStorage.removeItem('gh_token'); window.location.reload(); }} className="flex items-center gap-2 text-stone-300 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all">
              <LogOut size={12} /> ВЫЙТИ
           </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-5xl font-black tracking-tighter italic capitalize">{activeTab}</h1>
             <p className="text-stone-400 font-bold text-xs mt-2">Редактирование контента бест-френд.рф</p>
          </div>
          <button onClick={saveToGitHub} disabled={loading} className="py-5 px-10 bg-[#141414] text-white rounded-full font-black flex items-center gap-3 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] active:scale-95 disabled:opacity-50 hover:bg-[#ff7e27] hover:scale-105 active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            ОПУБЛИКОВАТЬ НА САЙТ
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
                <div key={room.title + idx} className="bg-white p-8 rounded-[3.5rem] border border-stone-100 shadow-sm space-y-6 hover:shadow-xl transition-all">
                  <div className="flex gap-8">
                    <div className="w-40 h-40 rounded-3xl bg-stone-50 overflow-hidden relative group shrink-0 shadow-inner">
                       <img src={room.image} className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white text-center p-4">
                          <Upload size={24} className="mb-2" />
                          <span className="text-[10px] font-black uppercase">Изменить фото</span>
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
                       <div>
                          <label className="text-[9px] font-black text-stone-300 uppercase tracking-widest block mb-1">Название номера</label>
                          <input className="text-2xl font-black w-full bg-stone-50 p-4 rounded-xl outline-none focus:bg-white focus:ring-2 ring-[#99ed36]" value={room.title} onChange={(e) => {
                              const isCat = content.catRooms.some((r:any) => r.title === room.title);
                              const list = isCat ? [...content.catRooms] : [...content.dogRooms];
                              const rIdx = list.findIndex((r:any) => r.title === room.title);
                              list[rIdx].title = e.target.value;
                              setContent({...content, [isCat ? 'catRooms' : 'dogRooms']: list});
                          }} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-stone-300 uppercase tracking-widest block mb-1">Цена за сутки</label>
                            <input className="font-bold bg-stone-50 p-4 rounded-xl w-full outline-none" value={room.price} onChange={(e) => {
                               const isCat = content.catRooms.some((r:any) => r.title === room.title);
                               const list = isCat ? [...content.catRooms] : [...content.dogRooms];
                               const rIdx = list.findIndex((r:any) => r.title === room.title);
                               list[rIdx].price = e.target.value;
                               setContent({...content, [isCat ? 'catRooms' : 'dogRooms']: list});
                            }} />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-stone-300 uppercase tracking-widest block mb-1">Площадь</label>
                            <input className="font-bold bg-stone-50 p-4 rounded-xl w-full outline-none" value={room.area} onChange={(e) => {
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
                </div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-12">
               <div className="bg-white p-12 rounded-[4rem] border border-stone-100 space-y-10 shadow-sm">
                  <div className="space-y-6">
                    <label className="text-xs font-black uppercase tracking-widest text-[#99ed36] block">Основной текст</label>
                    <input className="w-full bg-stone-50 p-8 rounded-3xl font-black text-4xl tracking-tighter outline-none focus:bg-stone-100" value={content.about.title} onChange={(e) => setContent({...content, about: {...content.about, title: e.target.value}})} />
                    <textarea className="w-full bg-stone-50 p-8 rounded-3xl font-bold text-lg h-40 resize-none outline-none focus:bg-stone-100 opacity-70" value={content.about.subtitle} onChange={(e) => setContent({...content, about: {...content.about, subtitle: e.target.value}})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {content.about.features.map((feat: any, i: number) => {
                    const IconComp = (Icons as any)[feat.icon] || Info;
                    return (
                      <div key={i} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm space-y-6 group">
                        <div className="flex items-center justify-between">
                           <div className={`w-14 h-14 ${feat.color} rounded-2xl flex items-center justify-center text-[#141414] shadow-lg`}>
                              <IconComp size={24} />
                           </div>
                           <div className="flex gap-2">
                              {['bg-[#99ed36]', 'bg-[#ff7e27]', 'bg-stone-200'].map(c => (
                                <button key={c} onClick={() => {
                                  const newFeats = [...content.about.features];
                                  newFeats[i].color = c;
                                  setContent({...content, about: {...content.about, features: newFeats}});
                                }} className={`w-6 h-6 rounded-full border-2 ${c} ${feat.color === c ? 'border-black' : 'border-transparent'}`} />
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-xl">
                              <Settings size={14} className="text-stone-300" />
                              <input className="bg-transparent font-black w-full text-xs uppercase tracking-widest outline-none" value={feat.icon} onChange={(e) => {
                                 const newFeats = [...content.about.features];
                                 newFeats[i].icon = e.target.value;
                                 setContent({...content, about: {...content.about, features: newFeats}});
                              }} />
                           </div>
                           <input className="text-2xl font-black w-full bg-stone-50 p-4 rounded-xl outline-none" value={feat.title} onChange={(e) => {
                              const newFeats = [...content.about.features];
                              newFeats[i].title = e.target.value;
                              setContent({...content, about: {...content.about, features: newFeats}});
                           }} />
                           <textarea className="w-full bg-stone-50 p-4 rounded-xl font-bold text-sm h-24 resize-none outline-none opacity-60" value={feat.text} onChange={(e) => {
                              const newFeats = [...content.about.features];
                              newFeats[i].text = e.target.value;
                              setContent({...content, about: {...content.about, features: newFeats}});
                           }} />
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-8">
               <div className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-sm">
                  <h3 className="text-3xl font-black mb-10 italic">Наши правила</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {content.rules.main.map((rule: any, i: number) => {
                        const Icon = (Icons as any)[rule.icon] || CheckCircle2;
                        return (
                          <div key={i} className="p-8 bg-stone-50 rounded-[2.5rem] space-y-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                   <Icon size={20} className="text-[#99ed36]" />
                                </div>
                                <input className="font-black flex-1 bg-white px-4 py-3 rounded-xl outline-none" value={rule.title} onChange={(e) => {
                                   const newRules = {...content.rules};
                                   newRules.main[i].title = e.target.value;
                                   setContent({...content, rules: newRules});
                                }} />
                             </div>
                             <textarea className="w-full font-bold text-sm h-28 p-6 bg-white rounded-2xl resize-none outline-none opacity-70" value={rule.content} onChange={(e) => {
                                const newRules = {...content.rules};
                                newRules.main[i].content = e.target.value;
                                setContent({...content, rules: newRules});
                             }} />
                          </div>
                        );
                     })}
                  </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[3.5rem] border border-stone-100">
                     <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><X className="text-red-500" size={28} /> Стоп-лист</h3>
                     <div className="space-y-3">
                        {content.rules.stopList.map((item: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <input className="flex-1 bg-stone-50 px-6 py-4 rounded-xl font-bold text-sm outline-none" value={item} onChange={(e) => {
                                 const newList = [...content.rules.stopList];
                                 newList[i] = e.target.value;
                                 setContent({...content, rules: {...content.rules, stopList: newList}});
                              }} />
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3.5rem] border border-stone-100">
                     <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Check className="text-[#99ed36]" size={28} /> Что взять</h3>
                     <div className="space-y-3">
                        {content.rules.checklist.map((item: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <input className="flex-1 bg-stone-50 px-6 py-4 rounded-xl font-bold text-sm outline-none" value={item} onChange={(e) => {
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

          {activeTab === 'contacts' && (
            <div className="space-y-10">
               <div className="bg-white p-12 rounded-[4rem] border border-stone-100 space-y-12 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#99ed36]">
                           <Phone size={18} />
                           <label className="text-[10px] font-black uppercase tracking-widest">Телефон отеля</label>
                        </div>
                        <input className="w-full bg-stone-50 p-6 rounded-2xl font-black text-2xl outline-none" value={content.contacts.phone} onChange={(e) => setContent({...content, contacts: {...content.contacts, phone: e.target.value}})} />
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#99ed36]">
                           <Mail size={18} />
                           <label className="text-[10px] font-black uppercase tracking-widest">Email для писем</label>
                        </div>
                        <input className="w-full bg-stone-50 p-6 rounded-2xl font-black text-2xl outline-none" value={content.contacts.email} onChange={(e) => setContent({...content, contacts: {...content.contacts, email: e.target.value}})} />
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#99ed36]">
                       <Clock size={18} />
                       <label className="text-[10px] font-black uppercase tracking-widest">График работы</label>
                    </div>
                    <input className="w-full bg-stone-50 p-6 rounded-2xl font-black text-lg outline-none" value={content.contacts.schedule} onChange={(e) => setContent({...content, contacts: {...content.contacts, schedule: e.target.value}})} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#99ed36]">
                       <MapPin size={18} />
                       <label className="text-[10px] font-black uppercase tracking-widest">Точный адрес</label>
                    </div>
                    <textarea className="w-full bg-stone-50 p-8 rounded-3xl font-bold text-lg h-32 resize-none outline-none opacity-80" value={content.contacts.address} onChange={(e) => setContent({...content, contacts: {...content.contacts, address: e.target.value}})} />
                  </div>
               </div>

               <div className="bg-[#141414] p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl text-white">
                  <h3 className="text-2xl font-black flex items-center gap-4 italic"><ExternalLink className="text-[#99ed36]" /> Социальные сети</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                        { key: 'telegram', icon: Send, label: 'Telegram отеля' },
                        { key: 'max', icon: User, label: 'MAX (поддержка)' },
                        { key: 'whatsapp', icon: Phone, label: 'WhatsApp' }
                     ].map(sc => (
                        <div key={sc.key} className="space-y-4">
                           <div className="flex items-center gap-3 text-white/40">
                              {/* @ts-ignore */}
                              <sc.icon size={14} />
                              <label className="text-[9px] font-black uppercase tracking-widest">{sc.label}</label>
                           </div>
                           <input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-xs outline-none focus:border-[#99ed36] transition-all" value={content.contacts.social[sc.key]} onChange={(e) => {
                              const newSocial = {...content.contacts.social};
                              newSocial[sc.key] = e.target.value;
                              setContent({...content, contacts: {...content.contacts, social: newSocial}});
                           }} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'promo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {content.promo.items.map((item: any, i: number) => (
                <div key={i} className={`p-12 rounded-[3.5rem] border shadow-sm space-y-8 flex flex-col ${item.textWhite ? 'bg-[#141414] text-white' : 'bg-white text-[#141414]'}`}>
                  <div className="space-y-4">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${item.textWhite ? 'text-white/30' : 'text-stone-300'}`}>Блок акции {i+1}</label>
                    <input className={`text-2xl font-black w-full bg-transparent border-b-2 outline-none pb-4 ${item.textWhite ? 'border-white/10' : 'border-stone-100'}`} value={item.title} onChange={(e) => {
                      const newItems = [...content.promo.items];
                      newItems[i].title = e.target.value;
                      setContent({...content, promo: {...content.promo, items: newItems}});
                    }} />
                  </div>
                  <textarea className={`w-full bg-transparent font-bold text-sm h-32 resize-none opacity-80 outline-none`} value={item.text} onChange={(e) => {
                    const newItems = [...content.promo.items];
                    newItems[i].text = e.target.value;
                    setContent({...content, promo: {...content.promo, items: newItems}});
                  }} />
                  <div className="mt-auto pt-6 flex flex-col gap-4">
                    <div className="flex gap-4">
                       <input className="w-24 p-5 rounded-2xl bg-white/10 font-black text-center text-xl" value={item.discount} onChange={(e) => {
                        const newItems = [...content.promo.items];
                        newItems[i].discount = e.target.value;
                        setContent({...content, promo: {...content.promo, items: newItems}});
                       }} />
                       <input className="flex-1 p-5 rounded-2xl bg-white/10 font-bold italic text-sm" value={item.note} onChange={(e) => {
                        const newItems = [...content.promo.items];
                        newItems[i].note = e.target.value;
                        setContent({...content, promo: {...content.promo, items: newItems}});
                       }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
             <div className="space-y-6">
                {content.faq.map((item: any, i: number) => (
                   <div key={i} className="bg-white p-10 rounded-[3rem] border border-stone-100 flex gap-6 hover:shadow-lg transition-all group">
                      <div className="flex-1 space-y-6">
                         <div>
                            <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest block mb-2">Вопрос</label>
                            <input className="w-full font-black text-xl bg-stone-50 p-5 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-[#99ed36]" value={item.q} onChange={(e) => {
                               const newFaq = [...content.faq];
                               newFaq[i].q = e.target.value;
                               setContent({...content, faq: newFaq});
                            }} />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest block mb-2">Ответ</label>
                            <textarea className="w-full font-bold text-sm bg-stone-50 p-6 rounded-2xl h-32 resize-none outline-none focus:bg-white focus:ring-2 ring-[#99ed36] opacity-70" value={item.a} onChange={(e) => {
                                const newFaq = [...content.faq];
                                newFaq[i].a = e.target.value;
                                setContent({...content, faq: newFaq});
                            }} />
                         </div>
                      </div>
                      <button onClick={() => setContent({...content, faq: content.faq.filter((_:any,idx:number) => idx !== i)})} className="p-6 text-stone-200 hover:text-red-500 hover:bg-red-50 rounded-[2rem] transition-all self-start">
                         <Trash2 size={24} />
                      </button>
                   </div>
                ))}
                <button onClick={() => setContent({...content, faq: [...content.faq, {q: "Новый вопрос?", a: "Текст ответа..."}]})} className="w-full py-8 bg-[#141414] text-white font-black rounded-full flex items-center justify-center gap-4 hover:bg-[#ff7e27] hover:scale-105 transition-all text-xl shadow-2xl">
                   <Plus size={28} /> ДОБАВИТЬ ВОПРОС
                </button>
             </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
               {content.gallery.map((img: any, i: number) => (
                  <div key={i} className="aspect-[4/5] rounded-[3rem] overflow-hidden group relative border-4 border-white shadow-2xl">
                     <img src={img.url} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4">
                        <button onClick={() => setContent({...content, gallery: content.gallery.filter((_:any,idx:number) => idx !== i)})} className="p-6 bg-red-500 text-white rounded-3xl hover:scale-110 transition-all shadow-2xl">
                           <Trash2 size={28} />
                        </button>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Удалить</span>
                     </div>
                  </div>
               ))}
               <label className="aspect-[4/5] bg-white border-4 border-dashed border-stone-100 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#99ed36] hover:bg-stone-50 transition-all group shadow-sm">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-[#99ed36] group-hover:scale-110 transition-all shadow-xl">
                     {imgLoading ? <Loader2 className="animate-spin" /> : <Plus size={32} />}
                  </div>
                  <span className="mt-4 text-xs font-black uppercase text-stone-400">Выбрать фото</span>
                  <input type="file" className="hidden" disabled={imgLoading} onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                        try {
                           const url = await compressAndUploadImage(file);
                           setContent({...content, gallery: [...content.gallery, { url, title: "Gallery", span: "col-span-1", rotate: 0 }]});
                           setStatus({ type: 'success', msg: 'Фото успешно добавлено!' });
                        } catch (err:any) { setStatus({ type: 'error', msg: err }); }
                     }
                  }} />
               </label>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {content.reviews.map((rev: any, i: number) => (
                  <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-stone-100 shadow-sm relative group flex flex-col hover:shadow-xl transition-all">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-1 text-[#ff7e27]">
                           {[...Array(5)].map((_, si) => (
                             <button key={si} onClick={() => {
                               const newRev = [...content.reviews];
                               newRev[i].stars = si + 1;
                               setContent({...content, reviews: newRev});
                             }}>
                               <Star size={16} fill={si < rev.stars ? "currentColor" : "none"} className={si < rev.stars ? 'text-[#ff7e27]' : 'text-stone-200'} />
                             </button>
                           ))}
                        </div>
                        <button onClick={() => setContent({...content, reviews: content.reviews.filter((_:any,idx:number) => idx !== i)})} className="text-stone-200 hover:text-red-500 transition-colors p-2">
                           <Trash2 size={18} />
                        </button>
                     </div>
                     <textarea className="flex-1 bg-stone-50 rounded-2xl p-6 font-bold text-sm text-stone-600 outline-none h-48 resize-none mb-6 opacity-80" value={rev.text} onChange={(e) => {
                        const newRev = [...content.reviews];
                        newRev[i].text = e.target.value;
                        setContent({...content, reviews: newRev});
                     }} />
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <User size={14} className="text-stone-300" />
                           <input className="font-black text-xl w-full outline-none" value={rev.name} onChange={(e) => {
                              const newRev = [...content.reviews];
                              newRev[i].name = e.target.value;
                              setContent({...content, reviews: newRev});
                           }} />
                        </div>
                        <div className="flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-[#99ed36]" />
                           <input className="text-[10px] font-black uppercase text-[#99ed36] bg-[#99ed36]/5 px-4 py-2 rounded-full outline-none" value={rev.pet} onChange={(e) => {
                              const newRev = [...content.reviews];
                              newRev[i].pet = e.target.value;
                              setContent({...content, reviews: newRev});
                           }} />
                        </div>
                     </div>
                  </div>
               ))}
               <button onClick={() => setContent({...content, reviews: [{ name: "Имя клиента", pet: "Кот/Собака", text: "Ваш отзыв...", stars: 5, stayDate: "Март 2026" }, ...content.reviews]})} className="bg-white border-4 border-dashed border-stone-100 rounded-[3.5rem] flex flex-col items-center justify-center gap-4 hover:border-[#99ed36] transition-all group">
                  <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-[#99ed36] group-hover:text-white transition-all">
                      <Plus size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-stone-300">Добавить отзыв</span>
               </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
