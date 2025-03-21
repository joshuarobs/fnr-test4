Help me deploy this app CICD via github actions.

All github scripts work. http://170.64.188.76:3000/api works, but the base URL doesn't.
ssh results:


root@ubuntu-s-1vcpu-2gb-syd1-01:~# /var/www/fnr-app/scripts/frontend-diagnostics.sh
================================
=== FNR Frontend Diagnostics ===
================================
Running diagnostics on Thu Mar 20 22:13:13 UTC 2025

=== Environment Information ===
Node version: v20.19.0
NPM version: 10.8.2
Current directory: /root
NODE_ENV: production

=== Server Process ===
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name │ mode │ ↺ │ status │ cpu │ memory │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0 │ fnr-server-prod │ fork │ 0 │ online │ 0% │ 65.9mb │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

=== Application Directory Structure ===
Main application directory:
total 1032
drwxr-xr-x 8 root root 4096 Mar 20 22:06 .
drwxr-xr-x 3 root root 4096 Mar 20 21:57 ..
-rw------- 1 root root 6 Mar 20 21:57 .db_password
-rw------- 1 root root 243 Mar 20 21:57 .env
drwxr-xr-x 4 root root 4096 Mar 20 22:06 dist
drwxr-xr-x 2 root root 4096 Mar 20 22:06 docs
drwxr-xr-x 2 root root 4096 Mar 20 22:06 logs
drwxr-xr-x 339 root root 36864 Mar 20 22:06 node_modules
-rw-r--r-- 1 root root 967026 Mar 20 22:06 package-lock.json
-rw-r--r-- 1 root root 4904 Mar 20 22:06 package.json
drwxr-xr-x 4 root root 4096 Mar 20 22:06 prisma
drwxr-xr-x 2 root root 4096 Mar 20 22:06 scripts

Frontend directory:
total 36
drwxr-xr-x 3 root root 4096 Mar 20 22:06 .
drwxr-xr-x 4 root root 4096 Mar 20 22:06 ..
drwxr-xr-x 2 root root 4096 Mar 20 22:06 assets
-rw-r--r-- 1 root root 15086 Mar 20 22:06 favicon.ico
-rw-r--r-- 1 root root 553 Mar 20 22:06 index.html
-rw-r--r-- 1 root root 278 Mar 20 22:06 manifest.json

Assets directory:
total 1864
drwxr-xr-x 2 root root 4096 Mar 20 22:06 .
drwxr-xr-x 3 root root 4096 Mar 20 22:06 ..
-rw-r--r-- 1 root root 1651058 Mar 20 22:06 index.70ptteHv.js
-rw-r--r-- 1 root root 77469 Mar 20 22:06 index.CRYDvnEj.css
-rw-r--r-- 1 root root 165252 Mar 20 22:06 vendor.CZwDhARp.js

=== Critical Files Check ===
✅ Found: /var/www/fnr-app/dist/main.js
✅ Found: /var/www/fnr-app/dist/fnr-app/index.html
✅ Found: /var/www/fnr-app/dist/fnr-app/assets

=== Recent Server Logs ===
Last 20 lines of app.log:
2025-03-20T22:06:36: frontendPath: '/var/www/fnr-app/dist/fnr-app',
2025-03-20T22:06:36: assetsPath: '/var/www/fnr-app/dist/fnr-app/assets',
2025-03-20T22:06:36: indexPath: '/var/www/fnr-app/dist/fnr-app/index.html'
2025-03-20T22:06:36: }
2025-03-20T22:06:36: 🌐 Serving frontend from: /var/www/fnr-app/dist/fnr-app
2025-03-20T22:06:36: 🌐 Serving assets from: /var/www/fnr-app/dist/fnr-app/assets
2025-03-20T22:06:36: Warning: connect.session() MemoryStore is not
2025-03-20T22:06:36: designed for a production environment, as it will leak
2025-03-20T22:06:36: memory, and will not scale past a single process.
2025-03-20T22:06:36: Listening at http://0.0.0.0:3000/api
2025-03-20T22:06:36: Server is ready to accept requests
2025-03-20T22:06:55: [2025-03-20T22:06:55.138Z] GET /api
2025-03-20T22:06:55: 📝 Static request for: /api
2025-03-20T22:06:55: [2025-03-20T22:06:55.535Z] GET /
2025-03-20T22:06:55: 📝 Static request for: /
2025-03-20T22:06:55: 📄 Served index.html for: /
2025-03-20T22:12:54: [2025-03-20T22:12:54.221Z] GET /api
2025-03-20T22:12:54: 📝 Static request for: /api
2025-03-20T22:12:54: [2025-03-20T22:12:54.318Z] GET /favicon.ico
2025-03-20T22:12:54: 📝 Static request for: /favicon.ico

Last 20 lines of error.log:
2025-03-20T22:06:36: Warning: connect.session() MemoryStore is not
2025-03-20T22:06:36: designed for a production environment, as it will leak
2025-03-20T22:06:36: memory, and will not scale past a single process.

=== 404 Errors Check ===
Recent 404 errors:

=== Endpoint Tests ===
Testing API endpoint:
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
Content-Length: 144
ETag: W/"90-8Z7hVQ7O+onrU25ul/WZltWBXe0"
Date: Thu, 20 Mar 2025 22:13:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5


Testing frontend endpoint:
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Thu, 20 Mar 2025 22:06:09 GMT
ETag: W/"229-195b597a55d"
Content-Type: text/html; charset=UTF-8
Content-Length: 553
Date: Thu, 20 Mar 2025 22:13:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5


Testing assets endpoint:
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Thu, 20 Mar 2025 22:06:09 GMT
ETag: W/"229-195b597a55d"
Content-Type: text/html; charset=UTF-8
Content-Length: 553
Date: Thu, 20 Mar 2025 22:13:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5


=== Static File Serving Configuration ===
Checking static file serving configuration in main.js:

=== Diagnostics Complete ===
If you're still experiencing issues, please check the following:
1. Ensure NODE_ENV is set to 'production'
2. Verify that the frontend build includes all necessary assets
3. Check that the server is correctly configured to serve static files
4. Ensure the assets directory exists and contains the required files
5. Restart the server using: pm2 restart all

root@ubuntu-s-1vcpu-2gb-syd1-01:~#


We tried this before, whatever changes u suggested, actually failed the build and deploy script, in the build phase:

The CI/CD deployment has been enhanced with the following improvements:

Frontend Asset Handling:

Vite now uses relative paths (base: './') for better asset references
Assets are properly chunked and named consistently
Server Configuration:

Enhanced static file serving with proper caching
Automatic directory creation if missing
Better error handling and logging
Improved SPA route handling
To verify the deployment:

The API endpoint should work: http://170.64.188.76:3000/api
The frontend should now work: http://170.64.188.76:3000
All static assets should load correctly
If you encounter any issues, you can run the diagnostics script on the server:
