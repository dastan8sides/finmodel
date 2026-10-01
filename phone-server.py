from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent
ALLOWED = {
    'index.html', 'styles.css', 'expanded.css', 'single-page.css',
    'convenience.css', 'game-theme.css', 'dock-panels.css', 'model-v2.js', 'zip.js',
    'export-v2.js', 'app-v2.js', 'convenience.js', 'dock-panels.js',
    'financial-core.js', 'financial-export.js', 'financial-ui.js',
}

class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        name = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
        if name not in ALLOWED:
            self.send_error(404)
            return None
        return super().send_head()

if __name__ == '__main__':
    import sys
    address = sys.argv[1] if len(sys.argv) > 1 else '127.0.0.1'
    ThreadingHTTPServer((address, 8766), AppHandler).serve_forever()
