"""Build a dependency-free load-unpacked distribution ZIP."""
from pathlib import Path
import zipfile
root=Path(__file__).resolve().parent
out=root/'dist';out.mkdir(exist_ok=True)
with zipfile.ZipFile(out/'xx-extension-0.1.0.zip','w',zipfile.ZIP_DEFLATED) as z:
    for pattern in ['*.js','*.html','*.css','manifest.json','shared/*.js','icons/*.png','_locales/*/*.json']:
        for file in sorted(root.glob(pattern)):
            z.write(file,file.relative_to(root))
print(out/'xx-extension-0.1.0.zip')
