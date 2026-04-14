import os
import shutil
import json
from PIL import Image

# Path configuration
BRAIN_PATH = r'C:\Users\User\.gemini\antigravity\brain\f4f21120-213f-46f2-93b1-c1cc0960579a'
PROJECT_PATH = r'c:\Users\User\Downloads\nneeeee'
GALLERY_DIR = os.path.join(PROJECT_PATH, 'public', 'images', 'gallery')
CONTENT_JSON_PATH = os.path.join(PROJECT_PATH, 'src', 'data', 'content.json')

MEDIA_FILES = [
    'media__1776157995493.jpg', 'media__1776157995547.jpg', 
    'media__1776157995566.jpg', 'media__1776157995589.jpg', 
    'media__1776157995606.jpg', 'media__1776158635113.jpg', 
    'media__1776158635132.jpg', 'media__1776158635245.jpg', 
    'media__1776158635279.jpg', 'media__1776158635294.jpg'
]

TITLE_MAP = [
    "Уютные номера для собак",
    "Игровая зона для кошек",
    "Просторный коридор отеля",
    "Наши апартаменты",
    "Зона отдыха котиков",
    "Входная группа Бест Френд",
    "Кошачий вольер с полками",
    "Комфортные боксы",
    "Вид на номера",
    "Светлые комнаты для питомцев"
]

def setup_gallery():
    # 1. Create directory
    if not os.path.exists(GALLERY_DIR):
        os.makedirs(GALLERY_DIR)
        print(f"Created directory: {GALLERY_DIR}")

    # 2. Copy and convert
    gallery_data = []
    
    # Layout configuration
    spans = ["col-span-2", "col-span-1", "col-span-1", "col-span-2", "col-span-1", "col-span-3", "col-span-1", "col-span-2", "col-span-1", "col-span-1"]
    rotates = [-1, 1, -1, 0, 1, 0, -1, 1, -1, 1]

    for i, media_file in enumerate(MEDIA_FILES):
        source = os.path.join(BRAIN_PATH, media_file)
        dest_filename = f"g{i+1}.webp"
        dest_path = os.path.join(GALLERY_DIR, dest_filename)
        
        try:
            if not os.path.exists(source):
                print(f"Warning: Source file not found: {source}")
                continue
                
            img = Image.open(source)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            
            img.save(dest_path, "WEBP", quality=85)
            print(f"Processed: {media_file} -> {dest_filename}")
            
            gallery_data.append({
                "url": f"/images/gallery/{dest_filename}",
                "title": TITLE_MAP[i],
                "span": spans[i % len(spans)],
                "rotate": rotates[i % len(rotates)]
            })
        except Exception as e:
            print(f"Error processing {media_file}: {e}")

    # 3. Update content.json
    try:
        with open(CONTENT_JSON_PATH, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        content['gallery'] = gallery_data
        
        with open(CONTENT_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"Updated {CONTENT_JSON_PATH}")
    except Exception as e:
        print(f"Error updating JSON: {e}")

if __name__ == "__main__":
    setup_gallery()
    print("\nDONE!")
