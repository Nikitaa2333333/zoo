import os
from PIL import Image

def optimize_large_images():
    # Файлы, которые по данным PageSpeed весят слишком много из-за огромного разрешения
    target_files = [
        "src/assets/hero_main.webp",
        "src/assets/hero_spa.webp",
        "public/images/rooms/cat_comfort.webp"
    ]
    
    max_width = 1600 # Уменьшаем до разумных 1600px
    
    project_dir = os.getcwd()
    
    for relative_path in target_files:
        path = os.path.join(project_dir, relative_path)
        if os.path.exists(path):
            try:
                img = Image.open(path)
                width, height = img.size
                
                if width > max_width:
                    # Вычисляем новую высоту с сохранением пропорций
                    new_height = int((max_width / width) * height)
                    
                    # Изменяем размер
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Сохраняем с хорошим сжатием
                    img.save(path, "WEBP", quality=85, optimize=True)
                    print(f"✅ Оптимизирован: {relative_path} ({width}x{height} -> {max_width}x{new_height})")
                else:
                    print(f"⏩ Пропущен (уже норм размер): {relative_path}")
            except Exception as e:
                print(f"❌ Ошибка с {relative_path}: {e}")
        else:
            print(f"⚠️ Файл не найден: {relative_path}")

if __name__ == "__main__":
    print("Начинаем оптимизацию больших изображений для PageSpeed...")
    optimize_large_images()
    print("Готово!")
