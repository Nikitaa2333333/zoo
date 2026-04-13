import os
from PIL import Image

def generate_mobile_images():
    target_files = [
        "src/assets/hero_main.webp",
        "src/assets/hero_spa.webp",
    ]
    
    project_dir = os.getcwd()
    
    for relative_path in target_files:
        path = os.path.join(project_dir, relative_path)
        if os.path.exists(path):
            try:
                img = Image.open(path)
                width, height = img.size
                
                # Создаем специальную версию для мобилок (800px)
                mobile_width = 800
                if width > mobile_width:
                    new_height = int((mobile_width / width) * height)
                    mobile_img = img.resize((mobile_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Имя файла для мобилок (добавляем -mobile)
                    base, ext = os.path.splitext(path)
                    mobile_path = f"{base}-mobile{ext}"
                    
                    mobile_img.save(mobile_path, "WEBP", quality=80, optimize=True)
                    print(f"✅ Создана мобильная версия: {os.path.basename(mobile_path)} ({mobile_width}x{new_height})")
            except Exception as e:
                print(f"❌ Ошибка с {relative_path}: {e}")
        else:
            print(f"⚠️ Файл не найден: {relative_path}")

if __name__ == "__main__":
    generate_mobile_images()
