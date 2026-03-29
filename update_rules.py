import re
import os

# Пути к файлам
rul_path = 'src/rul.txt'
app_path = 'src/App.tsx'

# Проверяем существование файлов
if not os.path.exists(app_path):
    print(f"Ошибка: Файл {app_path} не найден.")
    exit(1)

# Читаем App.tsx
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

# Подготовка точного текста из ваших данных
rules_sections_code = """
const rulesSections = {
  main: [
    {
      title: "Кого мы принимаем",
      icon: "Dog",
      content: "Мы принимаем кошек, собак (до 20 кг) старше 4-х месячного возраста, приученных к лотку/пеленке/выгулу."
    },
    {
      title: "Ветеринарный контроль",
      icon: "ShieldCheck",
      content: "Наличие ветеринарного паспорта с ежегодной вакцинацией. Вакцинация должна быть проведена не менее чем за 14 дней и не позднее 1 года до заселения."
    },
    {
      title: "Обработка и здоровье",
      icon: "CheckCircle2",
      content: "Обработка от глистов и паразитов не более чем за 3 месяца до заселения. Администратор проверяет отметки при заезде."
    },
    {
      title: "Безопасность",
      icon: "ShieldCheck",
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
"""

# 1. Добавляем недостающие иконки в импорт
icons_to_add = ["AlertTriangle", "XCircle"]
for icon in icons_to_add:
    if icon not in app_content:
        # Ищем строку импорта из lucide-react (она начинается на 3-й строке обычно)
        app_content = re.sub(r'(import \{.*?)(\} from \'lucide-react\';)', rf'\1  {icon}, \2', app_content, flags=re.DOTALL)

# 2. Заменяем rulesData на rulesSections
if "const rulesData" in app_content:
    app_content = re.sub(r'const rulesData = \[.*?\];', rules_sections_code, app_content, flags=re.DOTALL)

# 3. Полностью обновляем JSX секции #rules
new_rules_jsx = """
            {/* RULES SECTION (PRO MAX EDITION) */}
            <section id="rules" className="py-24 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#99ed36]/5 blur-[120px] rounded-full"></div>
              <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mb-16">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                    Правила <br /><span className="text-[#ff7e27]">размещения</span>
                  </h2>
                  <p className="text-xl text-stone-500 font-bold leading-relaxed">
                    Мы создали максимально безопасную среду. Ознакомьтесь с требованиями, основанными на многолетнем опыте заботы о животных.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {rulesSections.main.map((rule, idx) => {
                    const Icon = rule.icon === 'Dog' ? Dog : rule.icon === 'ShieldCheck' ? ShieldCheck : CheckCircle2;
                    return (
                      <div key={idx} className="p-10 bg-stone-50 rounded-[3rem] border border-stone-100 hover:border-[#99ed36]/30 transition-all group">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-10 text-[#ff7e27] shadow-sm shadow-orange-100 group-hover:rotate-12 transition-transform">
                          <Icon size={28} />
                        </div>
                        <h4 className="text-2xl font-black mb-6 leading-tight">{rule.title}</h4>
                        <p className="text-stone-400 font-bold text-[15px] leading-relaxed">
                          {rule.content}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* STOP LIST (DARK) */}
                  <div className="lg:col-span-5 bg-[#141414] text-white p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 blur-3xl rounded-full group-hover:bg-red-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-10 text-red-500">
                        <XCircle size={32} />
                        <h3 className="text-3xl font-black tracking-tighter">Мы не принимаем</h3>
                      </div>
                      <div className="space-y-4">
                        {rulesSections.stopList.map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <AlertTriangle size={18} className="text-red-500/50 mt-1 shrink-0" />
                            <span className="font-bold text-white/70 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CHECKLIST (ACCENT) */}
                  <div className="lg:col-span-7 bg-[#99ed36] p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/20 blur-3xl rounded-full"></div>
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                          <Check size={24} strokeWidth={4} />
                        </div>
                        <h3 className="text-3xl font-black text-[#141414] tracking-tighter">Что взять с собой</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 flex-1">
                        {rulesSections.checklist.map((item, i) => (
                          <div key={i} className="bg-white/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/20 hover:bg-white/60 transition-all group/item">
                            <span className="text-[#141414] font-black text-xs leading-tight flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 pt-8 border-t border-black/5 font-bold text-[10px] text-black/40 uppercase tracking-widest">
                        * Оригиналы документов находятся у нас весь срок пребывания
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 p-10 bg-stone-50 rounded-[3rem] border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <FileText size={32} className="text-[#ff7e27]" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-1">Юридическое оформление</h4>
                      <p className="text-stone-400 font-bold">Договор и анкета постояльца оформляются в обязательном порядке</p>
                    </div>
                  </div>
                  <button className="bg-[#141414] text-white px-10 py-5 rounded-full font-black hover:bg-[#ff7e27] hover:scale-105 transition-all shadow-xl active:scale-95">
                    Скачать образец договора
                  </button>
                </div>
              </div>
            </section>
"""

start_tag = '{/* RULES */}'
end_tag = '{/* PROMOTIONS */}'

if start_tag in app_content and end_tag in app_content:
    parts = app_content.split(start_tag)
    # Сохраняем часть до тега
    before_rules = parts[0]
    # Берем часть после тега и ищем конец секции
    rest = parts[1].split(end_tag)
    after_rules = rest[1]
    
    final_content = before_rules + start_tag + new_rules_jsx + end_tag + after_rules
    
    with open(app_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("App.tsx успешно обновлен. Секция правил полностью переработана.")
else:
    print("Ошибка: Теги {/* RULES */} или {/* PROMOTIONS */} не найдены в App.tsx")
