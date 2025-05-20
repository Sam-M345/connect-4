from livereload import Server

PORT = 3000

server = Server()

# Add files and directories to watch
# When these files change, the browser will automatically reload.
# For CSS changes, it will inject the styles without a full page reload.
server.watch('index.html')
server.watch('CSS/style.css')
server.watch('CSS/ocean-theme.css')
server.watch('animation.js')
server.watch('script.js')
server.watch('game/*.js') # Watches all .js files in the 'game' directory

print(f"Starting live-reloading server at http://localhost:{PORT}")
print("Stop the server with Ctrl+C")

# server.serve() is a blocking call
server.serve(port=PORT, host='0.0.0.0', root='.') 