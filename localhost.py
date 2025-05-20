from livereload import Server

PORT = 3000

server = Server()

# Add files and directories to watch
# When these files change, the browser will automatically reload.
# For CSS changes, it will inject the styles without a full page reload.
server.watch('index.html')
server.watch('style.css')
server.watch('animation.js')
server.watch('script.js')
server.watch('game/*.js') # Watches all .js files in the 'game' directory

print(f"Starting live-reloading server at http://localhost:{PORT}")
print("Stop the server with Ctrl+C")

# server.serve() is a blocking call
server.serve(port=PORT, host='localhost', root='.') 