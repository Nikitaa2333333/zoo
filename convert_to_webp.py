import os
import re
from PIL import Image

def convert_images_to_webp(root_dir):
    extensions = ('.png', '.jpg', '.jpeg')
    changed_files = 0
    
    # First pass: Convert images
    for subdir, dirs, files in os.walk(root_dir):
        # Skip node_modules and .git
        if 'node_modules' in subdir or '.git' in subdir:
            continue
            
        for file in files:
            if file.lower().endswith(extensions):
                base_name = os.path.splitext(file)[0]
                source_path = os.path.join(subdir, file)
                dest_path = os.path.join(subdir, base_name + '.webp')
                
                try:
                    img = Image.open(source_path)
                    # Convert to RGB if needed (e.g. for JPEG, PNG can have alpha)
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGBA")
                    else:
                        img = img.convert("RGB")
                    
                    img.save(dest_path, "WEBP", quality=90)
                    print(f"Converted: {file} -> {base_name}.webp")
                    
                    # Remove original
                    os.remove(source_path)
                    changed_files += 1
                except Exception as e:
                    print(f"Error converting {file}: {e}")

    print(f"\nConverted {changed_files} images to WebP.")

    # Second pass: Update references in code
    print("\nUpdating references in code...")
    code_extensions = ('.tsx', '.ts', '.css', '.html', '.json', '.txt')
    replacement_count = 0
    
    # Regex to find .png, .jpg, .jpeg inside strings or common code patterns
    # We want to match only the extension part if it follows a filename-like structure
    pattern = re.compile(r'\.(png|jpg|jpeg)(?=["\'\)\s])', re.IGNORECASE)

    for subdir, dirs, files in os.walk(root_dir):
        if 'node_modules' in subdir or '.git' in subdir:
            continue
            
        for file in files:
            if file.lower().endswith(code_extensions):
                file_path = os.path.join(subdir, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content, count = pattern.subn('.webp', content)
                    
                    if count > 0:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {count} references in {file}")
                        replacement_count += count
                except Exception as e:
                    print(f"Error updating {file}: {e}")

    print(f"\nTotal references replaced: {replacement_count}")

if __name__ == "__main__":
    project_dir = os.getcwd()
    print(f"Starting conversion in {project_dir}...")
    
    # Check if pillow is installed
    try:
        from PIL import Image
    except ImportError:
        print("Pillow is NOT installed. Please run: pip install pillow")
        exit(1)
        
    convert_images_to_webp(project_dir)
    print("\nDONE!")
