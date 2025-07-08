#!/usr/bin/env python3
import http.server
import socketserver
from urllib.parse import urlparse


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        # Handle .html files with hash fragments -> redirect to clean URLs
        if path.endswith(".html") and parsed_path.fragment:
            # Redirect index.html#fragment to /#fragment
            if path == "/index.html":
                clean_path = "/#" + parsed_path.fragment
            else:
                # For other .html files, remove .html extension
                clean_path = path[:-5] + "#" + parsed_path.fragment

            self.send_response(301)
            self.send_header("Location", clean_path)
            self.end_headers()
            return

        # Handle routes without .html extension -> add .html extension
        if not path.endswith("/") and "." not in path.split("/")[-1]:
            # Check if corresponding .html file exists
            html_path = path + ".html"
            try:
                # Try to open the file to see if it exists
                with open("." + html_path, "r"):
                    self.path = html_path
            except FileNotFoundError:
                # File doesn't exist, let the default handler deal with it
                pass

        # Call the parent handler
        super().do_GET()


PORT = 3000
Handler = CustomHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
