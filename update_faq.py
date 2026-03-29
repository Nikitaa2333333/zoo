import os
import re

def update_faq():
    faq_file = 'qq.txt'
    app_file = 'src/App.tsx'
    
    if not os.path.exists(faq_file):
        print(f"Ошибка: Файл {faq_file} не найден.")
        return
    
    # Читаем вопросы и ответы из qq.txt (разделитель - табуляция)
    faq_entries = []
    with open(faq_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            # Пробуем разделить по табуляции
            parts = line.split('\t')
            if len(parts) >= 2:
                q = parts[0].strip()
                a = parts[1].strip()
                faq_entries.append({"q": q, "a": a})
    
    if not faq_entries:
        print("Вопросы не найдены. Проверьте, что в qq.txt между вопросом и ответом стоит Tab.")
        return

    # Читаем содержимое App.tsx
    with open(app_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Формируем новую строку для faqData
    new_faq_data = "const faqData = [\n"
    for i, entry in enumerate(faq_entries):
        q = entry['q'].replace('"', '\\"')
        a = entry['a'].replace('"', '\\"')
        comma = "," if i < len(faq_entries) - 1 else ""
        new_faq_data += f'  {{ q: "{q}", a: "{a}" }}{comma}\n'
    new_faq_data += "];"
    
    # Заменяем старый блок faqData на новый с помощью регулярного выражения
    pattern = r'const faqData = \[.*?\];'
    new_content = re.sub(pattern, new_faq_data, content, flags=re.DOTALL)
    
    # Записываем изменения в App.tsx
    with open(app_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Готово! Секция FAQ обновлена ({len(faq_entries)} вопросов).")

if __name__ == "__main__":
    update_faq()
