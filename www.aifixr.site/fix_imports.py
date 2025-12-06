import os
import re

def fix_imports_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # @radix-ui 패키지에서 버전 번호 제거
    content = re.sub(r'@radix-ui/([^"\'\s@]+)@[\d.]+', r'@radix-ui/\1', content)
    
    # class-variance-authority에서 버전 번호 제거
    content = re.sub(r'class-variance-authority@[\d.]+', 'class-variance-authority', content)
    
    # lucide-react에서 버전 번호 제거
    content = re.sub(r'lucide-react@[\d.]+', 'lucide-react', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {os.path.basename(filepath)}")
        return True
    return False

def process_directory(directory):
    fixed_count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                if fix_imports_in_file(filepath):
                    fixed_count += 1
    return fixed_count

if __name__ == '__main__':
    ui_dir = os.path.join(os.path.dirname(__file__), 'components', 'ui')
    print('Fixing import paths...\n')
    count = process_directory(ui_dir)
    print(f'\nFixed {count} files.')
