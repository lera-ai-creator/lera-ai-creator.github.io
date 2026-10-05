# Печать резюме в PDF через Chrome без окна. Запуск: python build_cv.py
import os, subprocess, pathlib
import fitz  # PyMuPDF — только для проверки: число страниц и картинка-превью

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / 'assets' / 'cv' / 'Lera_Chernogubova_CV.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                '--allow-file-access-from-files', '--virtual-time-budget=4000',
                f'--print-to-pdf={OUT}', (HERE / 'cv.html').as_uri()], check=True, capture_output=True)
doc = fitz.open(OUT)
# метаданные PDF: часть систем отбора индексирует автора, тему и ключевые слова
doc.set_metadata({'title': 'Лера Черногубова — AI Creator, AI-художник и аниматор — резюме',
                  'author': 'Лера Черногубова',
                  'subject': 'Резюме: AI Creator, AI-художник, генеративный ИИ, AI-анимация',
                  'keywords': 'AI Creator, AI-художник, аниматор, генеративный ИИ, нейросети, AI-анимация, ИИ-мультипликация, '
                              'ComfyUI, Stable Diffusion, Midjourney, Kling, Veo, Runway, промпт-инжиниринг, Photoshop, Illustrator, Figma',
                  'creator': 'Лера Черногубова', 'producer': ''})
doc.saveIncr()
print(OUT, 'страниц:', len(doc), f'{OUT.stat().st_size // 1024} КБ')
doc[0].get_pixmap(dpi=110).save(HERE / 'cv_preview.png')
